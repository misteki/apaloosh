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
    const { fov_map, discovered_map } = camera;
    const map_x = Math.floor(camera.x / TILE_SIZE);
    const map_y = Math.floor(camera.y / TILE_SIZE);
    map(map_x, map_y, camera.width + 1, camera.height + 1, tilemap.x - (camera.x % TILE_SIZE), tilemap.y - (camera.y % TILE_SIZE), 0, 1);
    /* old remap
    if (camera.fov_map) {
            return camera.fov_map[x][y] ? tile_id : 0;
        }
        return tile_id;
    */
    if (fov_map) {
        for (let x = map_x; x < map_x + camera.width + 1; x++) {
            for (let y = map_y; y < map_y + camera.height + 1; y++) {
                if (fov_map[x]) {
                    if (!fov_map[x][y]) {
                        if (discovered_map[x][y]) {
                            spr(238, (x - map_x) * TILE_SIZE, (y - map_y) * TILE_SIZE, 1);
                        } else {
                            spr(0, (x - map_x) * TILE_SIZE, (y - map_y) * TILE_SIZE, 1);
                        }
                    }
                } else {
                    if (discovered_map[x][y]) {
                        spr(238, (x - map_x) * TILE_SIZE, (y - map_y) * TILE_SIZE, 1);
                    } else {
                        spr(0, (x - map_x) * TILE_SIZE, (y - map_y) * TILE_SIZE, 1);
                    }
                }
            }
        }
    }
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