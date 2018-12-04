const create_tile = (id, flags = []) => ({
    id,
    flags: flags.reduce((accumulator: boolean[], flag: number) => {
        accumulator[flag] = true;
        return accumulator;
    }, [])
});

/* TILESET */

const add_tiles_flag = (tileset, flag: number, tiles: number[]) => {
    tiles.forEach((tile_id: number) => {
        if (!tileset.flags[tile_id]) {
            tileset.flags[tile_id] = [flag];
        } else {
            tileset.flags[tile_id].push(flag);
        }
    })
}

const add_tile_spawner = (tileset, id: number, spawner: (id: number, x: number, y: number) => any) => {
    tileset.spawners[id] ? tileset.spawners[id].push(spawner) : tileset.spawners[id] = [spawner];
}

const create_tileset = () => {
    return {
        flags: [],
        spawners: []
    }
};

/* TILEMAP */

const draw_tilemap = (tilemap, camera = { x: 0, y: 0, width: 0, height: 0, fov_map: null, discovered_map: null }) => {
    const { x: c_x, y: c_y, width: c_width, height: c_height, fov_map, discovered_map } = camera;
    const map_x = Math.floor(c_x / TILE_SIZE);
    const map_y = Math.floor(c_y / TILE_SIZE);
    const map_offset_x = tilemap.x - (c_x % TILE_SIZE);
    const map_offset_y = tilemap.y - (c_y % TILE_SIZE);
    const fog = [];
    map(map_x, map_y, c_width + 1, c_height + 1, map_offset_x, map_offset_y, 0, 1, (tile_id, x, y) => {
        // Gather fog painting data
        const is_visible = fov_map[x] && fov_map[x][y];
        const is_discovered = discovered_map[x] && discovered_map[x][y];
        if (!is_visible) {
            if (is_discovered) {
                const screen_x = map_offset_x + (x - map_x) * TILE_SIZE;
                const screen_y = map_offset_y + (y - map_y) * TILE_SIZE;
                fog.push({ screen_x, screen_y, sprite_id: 238 });
            } else {
                return 0;
            }
        }
        return tile_id;
    });

    //Paint fog
    fog.forEach(({ screen_x, screen_y, sprite_id }) => {
        //draw_fog(screen_x, screen_y, 1);
        spr(sprite_id, screen_x, screen_y, 1);
    });

};

// Get tile at pixel coordinates
const get_tile = (tilemap, map_x, map_y) => {
    const tile_id = mget(map_x, map_y);
    const flags = tilemap.tileset.flags[tile_id];
    return create_tile(tile_id, flags);
}

const create_tilemap = (x, y, width, height, tileset, remap = null) => ({
    x,
    y,
    width,
    height,
    tileset,
    remap
});