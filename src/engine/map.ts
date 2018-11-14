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

const draw_tilemap = (tilemap, camera = { x: 0, y: 0, fov_map: null }) => {
    const map_x = Math.floor(camera.x / TILE_SIZE);
    const map_y = Math.floor(camera.y / TILE_SIZE);
    map(map_x, map_y, tilemap.width + 1, tilemap.height + 1, tilemap.x - (camera.x % TILE_SIZE), tilemap.y - (camera.y % TILE_SIZE), 0, 1, (tile_id, x, y) => {
        if (camera.fov_map) {
            return camera.fov_map[x - map_x][y - map_y] ? tile_id : 0;
        }
        return tile_id;
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