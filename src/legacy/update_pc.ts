/*
const { movement } = pc;
    const { direction } = movement;
    const { map, camera } = state;
    switch (direction) {
        case Direction.LEFT:
            if (!get_tile(map, pc.map_x - 1, pc.map_y).flags[TileFlags.SOLID]) {
                movement.target.x = pc.map_x - 1;
                movement.moving = true;
            }
            break;
        case Direction.RIGHT:
            if (!get_tile(map, pc.map_x + 1, pc.map_y).flags[TileFlags.SOLID]) {
                movement.target.x = pc.map_x + 1;
                movement.moving = true;
            }
            break;
        case Direction.UP:
            if (!get_tile(map, pc.map_x, pc.map_y - 1).flags[TileFlags.SOLID]) {
                movement.target.y = pc.map_y - 1;
                movement.moving = true;
            }
            break;
        case Direction.DOWN:
            if (!get_tile(map, pc.map_x, pc.map_y + 1).flags[TileFlags.SOLID]) {
                movement.target.y = pc.map_y + 1;
                movement.moving = true;
            }
            break;
    }
    // Tween
    if (movement.moving) {
        const speed = Math.round(dt * 50);
        const { x: target_x, y: target_y } = movement.target;
        const arrived_x = pc.x === target_x * TILE_SIZE;
        const arrived_y = pc.y === target_y * TILE_SIZE;
        if (arrived_x && arrived_y) {
            pc.map_x = target_x;
            pc.map_y = target_y;
            movement.moving = false;
            state.pc_moved = true;
            sfx(63, 0, 2, 0, 1);
        } else {
            if (!arrived_x) {
                camera.x = (target_x * TILE_SIZE) - pc.x > 0 ? camera.x + speed : camera.x - speed;
                pc.x = (target_x * TILE_SIZE) - pc.x > 0 ? pc.x + speed : pc.x - speed;
            }
            if (!arrived_y) {
                camera.y = (target_y * TILE_SIZE) - pc.y > 0 ? camera.y + speed : camera.y - speed;
                pc.y = (target_y * TILE_SIZE) - pc.y > 0 ? pc.y + speed : pc.y - speed;
            }
        }
    }
}
*/