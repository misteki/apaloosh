const create_camera = (map_center_x, map_center_y, width, height, map) => {
    const screen_x = (map_center_x - Math.floor(width / 2)) * TILE_SIZE;
    const screen_y = (map_center_y - Math.floor(height / 2) + 1) * TILE_SIZE;
    return {
        x: screen_x,
        y: screen_y,
        width,
        height,
        fov_map: [],
        discovered_map: [],
    };
}

const bresenham = (x1, y1, x2, y2) => {
    const coordinatesArray = [];
    // Translate coordinates
    // Define differences and error check
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = (x1 < x2) ? 1 : -1;
    const sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;
    // Set first coordinates
    // Main loop
    while (!((x1 == x2) && (y1 == y2))) {
        const e2 = err << 1;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
        // Set coordinates
        coordinatesArray.push({ x: x1, y: y1 });
    }
    // Return the result
    return coordinatesArray;
}

const update_camera_fov = (camera, map, pov_x, pov_y) => {
    const { discovered_map, width, height } = camera;
    const init_time = time();
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

    /* test permissive fov */
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