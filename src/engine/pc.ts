const step_pc = (pc, state) => {
    const { movement } = pc;
    const { direction } = movement;
    const { map, turn_system } = state;
    let acted = false;

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
        const target_coords = { x: pc.map_x + move_coords.x, y: pc.map_y + move_coords.y };
        const target_tile = get_tile(map, target_coords.x, target_coords.y);
        if (!tile_has_flag(target_tile, TileFlags.SOLID)) {
            pc.map_x = pc.map_x + move_coords.x;
            pc.map_y = pc.map_y + move_coords.y;
            acted = true;
        } else if (tile_has_flag(target_tile, TileFlags.OPENABLE)) {
            tile_handle_event(target_tile, TileEvents.OPEN, target_coords.x, target_coords.y);
            sfx(63, 0, -1, 1, 15);
            acted = true;
        }
    }
    // If any action was performed
    if (acted) {
        turn_system.processing = true;
        pc.stats.ap = pc.stats.ap - 1;
    }
}

const update_pc = (pc, dt, state) => {
    const { movement } = pc;
    const { camera } = state;
    // Tween
    const arrived_x = pc.x === pc.map_x * TILE_SIZE;
    const arrived_y = pc.y === pc.map_y * TILE_SIZE;
    const speed = Math.round(dt * movement.speed);
    if (!arrived_x) {
        camera.x = (pc.map_x * TILE_SIZE) - pc.x > 0 ? camera.x + speed : camera.x - speed;
        pc.x = (pc.map_x * TILE_SIZE) - pc.x > 0 ? pc.x + speed : pc.x - speed;
    }
    if (!arrived_y) {
        camera.y = (pc.map_y * TILE_SIZE) - pc.y > 0 ? camera.y + speed : camera.y - speed;
        pc.y = (pc.map_y * TILE_SIZE) - pc.y > 0 ? pc.y + speed : pc.y - speed;
    }
}

const create_pc = (map_x, map_y) => {
    return {
        x: map_x * TILE_SIZE,
        y: map_y * TILE_SIZE,
        map_x,
        map_y,
        sprite: create_sprite(272),
        stats: { hp: 10, total_hp: 10, ap: 1, leftover_ap: 0, speed: 0 },
        movement: { direction: null, moving: false, speed: 40, target: { x: map_x, y: map_y } },
    };
}