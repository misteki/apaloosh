const create_actor = (map_x, map_y, sprite_id, colorkey = 1) => {
    return {
        x: map_x * TILE_SIZE,
        y: map_y * TILE_SIZE,
        map_x,
        map_y,
        sprite: create_sprite(sprite_id, { colorkey }),
    }
}

const draw_actor = (actor, camera = { x: 0, y: 0 }) => {
    draw_sprite(actor.x - camera.x, actor.y - camera.y, actor.sprite);
}

const step_npc = (npc, dt, state) => {
    //RANDOM MOV
    const direction = Math.floor(Math.random() * 5);
    switch (direction) {
        case Direction.LEFT:
            npc.map_x -= 1;
            break;
        case Direction.RIGHT:
            npc.map_x += 1;
            break;
        case Direction.UP:
            npc.map_y -= 1;
            break;
        case Direction.DOWN:
            npc.map_y += 1;
            break;
    }
}

const update_npc = (npc, dt, state) => {
    // Tween
    const speed = Math.round(dt * 50);
    if (npc.x !== npc.map_x * TILE_SIZE) {
        npc.x = (npc.map_x * TILE_SIZE) - npc.x > 0 ? npc.x + speed : npc.x - speed;
    }
    if (npc.y !== npc.map_y * TILE_SIZE) {
        npc.y = (npc.map_y * TILE_SIZE) - npc.y > 0 ? npc.y + speed : npc.y - speed;
    }

};