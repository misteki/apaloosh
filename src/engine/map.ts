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

const draw_tilemap = (tilemap, camera = { x: 0, y: 0, width: 0, height: 0 }) => {
    const { x: c_x, y: c_y, width: c_width, height: c_height } = camera;
    const map_x = Math.floor(c_x / TILE_SIZE);
    const map_y = Math.floor(c_y / TILE_SIZE);
    const map_start_x = Math.max(map_x, 0);
    const map_start_y = Math.max(map_y, 0);
    const offset_x = map_x >= 0 ?
        tilemap.x - c_x % TILE_SIZE :
        tilemap.x + Math.abs(c_x);
    const offset_y = map_y >= 0 ?
        tilemap.y - c_y % TILE_SIZE :
        tilemap.y + Math.abs(c_y);
    const map_width = c_width + 1 - Math.max(0, map_x + c_width - tilemap.width);
    const map_height = c_height + 1 - Math.max(0, map_y + c_height - tilemap.height);
    // +1 added to height and width to account for newly explored tiles while moving
    map(map_start_x, map_start_y, map_width, map_height, offset_x, offset_y, 0, 1);
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