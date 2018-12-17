//  *GLOBALS    //
let $t: number = 0;
let $dt: number = 0;
let $input_manager;

const init: () => void = () => {
    const pc = create_pc(36, 22);
    const npcs = [
        create_actor(37, 23, 261),
        create_actor(40, 22, 262),
        create_actor(42, 46, 268),
        create_actor(51, 40, 276),
    ];

    //Create map
    const fov_width = 30;
    const fov_height = 16;
    const map_width = 30 * 8; // In tiles
    const map_height = 17 * 8 // In tiles
    const tileset = create_tileset();
    add_tiles_flag(tileset, TileFlags.SOLID, [3, 5]);
    add_tiles_flag(tileset, TileFlags.OPAQUE, [1, 3, 5, 6]);
    const map = create_tilemap(0, 0, map_width, map_height, tileset);
    const pc_moved = false;

    // Camera
    const fov_radius = 20;
    const fov = create_field_of_view(fov_radius, Math.floor(fov_width / 2) + 1, Math.floor(fov_height / 2) + 1, {
        full_fog_sprite_id: 0,
        partial_fog_sprite_id: 238,
        fog_sprite_colorkey: 1
    });
    update_fov(fov, map, pc.map_x, pc.map_y);

    const camera = create_camera(pc.map_x, pc.map_y, fov_width, fov_height, fov);

    return {
        pc, npcs, camera, map, pc_moved
    }
};

let state;

function TIC() {
    // -------------------- INIT --------------------
    if ($t === 0) {
        state = init();
    }
    const { pc, npcs } = state;

    // -------------------- TIMER UPDATES --------------------
    const nt: number = time();
    $dt = (nt - $t) / 1000;
    $t = nt;

    // -------------------- INPUT -------------------- 
    const input = get_input(false);
    //PC movement
    const direction: Direction = is_pressed(input, Button.LEFT) ? Direction.LEFT : (is_pressed(input, Button.RIGHT) ? Direction.RIGHT : (is_pressed(input, Button.UP) ? Direction.UP : (is_pressed(input, Button.DOWN) ? Direction.DOWN : Direction.NONE)));
    pc.movement.direction = direction;

    // -------------------- LOGIC -------------------- 
    update_pc(pc, $dt, state);
    if (state.pc_moved) {
        update_fov(state.camera.fov, state.map, pc.map_x, pc.map_y);
    }

    npcs.forEach((npc) => {
        if (state.pc_moved) {
            step_npc(npc, $dt, state);
        }
        update_npc(npc, $dt, state);
    });
    state.pc_moved = false;
    // -------------------- DRAW --------------------
    cls(0);
    const { map, camera } = state;
    draw_tilemap(map, camera);

    // Actors
    const fov = state.camera.fov;
    [...npcs, pc].forEach((actor) => {
        // Is actor within FOV
        if (fov.visible_map && fov.visible_map[actor.map_x] && fov.visible_map[actor.map_x][actor.map_y]) {
            draw_actor(actor, camera);
        }
    });

    draw_fog(fov, map, camera);


    // STATUS PANEL
    rect(0, 128, 240, 8, 8);
    print('Misteki', 2, 129, 14);
    const commands = "A)Action  B)Show order";
    print(commands, SCREEN_WIDTH - commands.length * 4, 129, 14, true, 1, true);

}
