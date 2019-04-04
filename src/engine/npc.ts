const NPC_DEFAULT_STATS = { hp: 10, total_hp: 10, ap: 1, leftover_ap: 0, speed: 8 };
const NPC_DEFAULT_METADATA = {
    name: "Cheedo",
    description: "A shadow of a man, covered by a colorful poncho"
};

const create_npc = (map_x, map_y, sprite, stats = null, metadata = null) => {
    const actual_stats = { ...NPC_DEFAULT_STATS, ...stats };
    const actual_metadata = { ...NPC_DEFAULT_METADATA, ...metadata };
    return {
        x: map_x * TILE_SIZE,
        y: map_y * TILE_SIZE,
        map_x,
        map_y,
        sprite,
        stats: actual_stats,
        metadata: actual_metadata,
    }
}

const draw_npc = (actor, camera = { x: 0, y: 0 }) => {
    draw_sprite(actor.x - camera.x, actor.y - camera.y, actor.sprite);
}

const step_npc = (npc, state) => {
    //RANDOM MOV
    const direction = Math.floor(Math.random() * 5);
    const { map } = state;
    let moved = false;
    let move_coords = { x: 0, y: 0 };
    switch (direction) {
        case Direction.LEFT:
            move_coords = { x: -1, y: 0 };
            moved = true;
            break;
        case Direction.RIGHT:
            move_coords = { x: 1, y: 0 };
            moved = true;
            break;
        case Direction.UP:
            move_coords = { x: 0, y: -1 };
            moved = true;
            break;
        case Direction.DOWN:
            move_coords = { x: 0, y: 1 };
            moved = true;
            break;
    }
    if (moved) {
        const target_coords = { x: npc.map_x + move_coords.x, y: npc.map_y + move_coords.y };
        const target_tile = get_tile(map, target_coords.x, target_coords.y);
        if (!tile_has_flag(target_tile, TileFlags.SOLID)) {
            npc.map_x = npc.map_x + move_coords.x;
            npc.map_y = npc.map_y + move_coords.y;
        }
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