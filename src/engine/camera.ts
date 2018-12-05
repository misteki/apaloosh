const create_camera = (map_center_x, map_center_y, width, height, use_fov = false) => {
    const screen_x = (map_center_x - Math.floor(width / 2)) * TILE_SIZE;
    const screen_y = (map_center_y - Math.floor(height / 2) + 1) * TILE_SIZE;
    return {
        x: screen_x,
        y: screen_y,
        width,
        height,
        use_fov,
        fov_map: [],
        discovered_map: [],
    };
}

const update_camera_fov = (camera, map, pov_x, pov_y) => {
    if (camera.use_fov) {
        const { discovered_map, width, height } = camera;
        const fov_map = [];
        //Cast rays
        const place_map_flag = (map, x, y, value) => {
            if (!map[x]) {
                map[x] = [];
            }
            if (!map[x][y]) {
                map[x][y] = value;
            }
        }

        /* Permissive fov to update visibility maps */
        const fov_x_length = Math.floor(width / 2) + 1;
        const fov_y_length = Math.floor(height / 2) + 1;
        const fov_radius = 10;
        field_of_view(pov_x, pov_y, fov_radius, fov_x_length, fov_y_length,
            (x, y) => {
                place_map_flag(discovered_map, x, y, true);
                place_map_flag(fov_map, x, y, true);
            },
            (x, y) => {
                return get_tile(map, x, y).flags[TileFlags.OPAQUE];
            },
        );
        camera.fov_map = fov_map;
    }
}

const draw_fog = (map, camera) => {
    if (camera.use_fov) {
        const { fov_map, discovered_map, x: c_x, y: c_y } = camera;
        const map_offset_x = map.x - (c_x % TILE_SIZE);
        const map_offset_y = map.y - (c_y % TILE_SIZE);
        const fog_sprite_colorkey = 1;
        //Paint fog
        // +1 added to height and width to account for newly explored tiles while moving
        for (let x = 0; x < camera.width + 1; x++) {
            for (let y = 0; y < camera.height + 1; y++) {
                const map_x = Math.floor(c_x / TILE_SIZE) + x;
                const map_y = Math.floor(c_y / TILE_SIZE) + y;
                const is_visible = fov_map[map_x] && fov_map[map_x][map_y];
                const is_discovered = discovered_map[map_x] && discovered_map[map_x][map_y];
                if (!is_visible) {
                    const screen_x = map_offset_x + x * TILE_SIZE;
                    const screen_y = map_offset_y + y * TILE_SIZE;
                    if (is_discovered) {
                        spr(238, screen_x, screen_y, fog_sprite_colorkey);
                    } else {
                        spr(0, screen_x, screen_y, fog_sprite_colorkey);
                    }
                }
            }
        }
    }
};