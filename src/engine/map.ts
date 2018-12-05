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
    // +1 added to height and width to account for newly explored tiles while moving
    map(map_x, map_y, c_width + 1, c_height + 1, map_offset_x, map_offset_y, 0, 1);
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