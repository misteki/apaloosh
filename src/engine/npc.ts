const create_npc = (map_x, map_y, sprite, stats = {}) => {
    return {
        x: map_x * TILE_SIZE,
        y: map_y * TILE_SIZE,
        map_x,
        map_y,
        sprite,
        stats: { hp: 10, total_hp: 10, ap: 1, leftover_ap: 0, speed: 8 },
    }
}

const draw_npc = (actor, camera = { x: 0, y: 0 }) => {
    draw_sprite(actor.x - camera.x, actor.y - camera.y, actor.sprite);
}

const step_npc = (npc, state) => {
    //RANDOM MOV
    const direction = Math.floor(Math.random() * 5);
    const { map } = state;
    const { map_x, map_y } = npc;
    switch (direction) {
        case Direction.LEFT:
            if (!get_tile(map, map_x - 1, map_y).flags[TileFlags.SOLID]) {
                npc.map_x -= 1;
            }
            break;
        case Direction.RIGHT:
            if (!get_tile(map, map_x + 1, map_y).flags[TileFlags.SOLID]) {
                npc.map_x += 1;
            }
            break;
        case Direction.UP:
            if (!get_tile(map, map_x, map_y - 1).flags[TileFlags.SOLID]) {
                npc.map_y -= 1;
            }
            break;
        case Direction.DOWN:
            if (!get_tile(map, map_x, map_y + 1).flags[TileFlags.SOLID]) {
                npc.map_y += 1;
            }
            break;
    }
    npc.stats.ap = npc.stats.ap - 1;
}

const update_npc = (npc, dt, state) => {
    // Tween
    const speed = Math.round(dt * 40);
    if (npc.x !== npc.map_x * TILE_SIZE) {
        npc.x = (npc.map_x * TILE_SIZE) - npc.x > 0 ? npc.x + speed : npc.x - speed;
    }
    if (npc.y !== npc.map_y * TILE_SIZE) {
        npc.y = (npc.map_y * TILE_SIZE) - npc.y > 0 ? npc.y + speed : npc.y - speed;
    }

};