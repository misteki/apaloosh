//  *GLOBALS    //
let $t: number = 0;
let $dt: number = 0;
let $input_manager;

const init: () => void = () => {
    const pc = create_pc(46, 48);
    const npcs = [
        create_npc(37, 23, create_sprite(261)),
        create_npc(40, 22, create_sprite(262)),
        create_npc(42, 46, create_sprite(268)),
        create_npc(51, 40, create_sprite(280)),
    ];

    //Create map
    const fov_width = 30;
    const fov_height = 16;
    const map_width = 30 * 8; // In tiles
    const map_height = 17 * 8 // In tiles
    const tileset = create_tileset(TILESET_DATA);

    const map = create_tilemap(0, 0, map_width, map_height, tileset);

    // Camera
    const fov_radius = 30;
    const fov = create_field_of_view(fov_radius, Math.floor(fov_width / 2) + 1, Math.floor(fov_height / 2) + 1, {
        full_fog_sprite_id: 0,
        partial_fog_sprite_id: 238,
        fog_sprite_colorkey: 1
    });
    update_fov(fov, map, pc.map_x, pc.map_y);

    const camera = create_camera(pc.map_x, pc.map_y, fov_width, fov_height, fov);

    const status_bar = {
        x: 0,
        y: 128,
        width: 240,
        height: 8,
        background_color: 8,
        font_color: 0,
        x_content_offset: 2,
        y_content_offset: 1
    }

    // "proccesing" flag freezes logic updates so we can take a whole game cycle to solely calculate CPU intensive tasks
    // (FOV , AI, others) without graphically lagging the game because of the big delta that cycle would have
    const turn_system = {
        state: TurnSystemState.ROUND_START,
        processing: false,
        simultaneous: true,
    };

    return {
        pc, npcs, camera, map, turn_system, status_bar,
    }
};

let state;

function TIC() {
    // -------------------- INIT --------------------
    if ($t === 0) {
        state = init();
    }
    const start_time = time();

    const { pc, npcs, turn_system } = state;

    // -------------------- TIMER UPDATES --------------------
    const nt: number = time();
    $dt = (nt - $t) / 1000;
    $t = nt;

    // -------------------- INPUT -------------------- 
    const input = get_input(false);
    //PC movement

    // -------------------- LOGIC --------------------
    update_turn_round(input, state);

    //Update logic
    update_pc(pc, $dt, state);
    if (!turn_system.processing) {
        npcs.forEach((npc) => {
            update_npc(npc, $dt, state);
        });
    }
    // -------------------- DRAW --------------------
    cls(0);
    const { map, camera, status_bar } = state;
    draw_tilemap(map, camera);

    // Actors
    const fov = state.camera.fov;
    [...npcs, pc].forEach((actor) => {
        // Is actor within FOV
        if (fov.visible_map && fov.visible_map[actor.map_x] && fov.visible_map[actor.map_x][actor.map_y]) {
            draw_npc(actor, camera);
        }
    });

    draw_fog(fov, map, camera);

    // STATUS PANEL
    const { background_color, font_color } = status_bar;
    rect(0, 128, 240, 8, background_color);
    print(`Misteki | `, 2, 129, font_color);
    print(`HP: ${pc.stats.hp}/${pc.stats.total_hp}`, 52, 129, font_color);
    const commands = ["Action", "Show order"];
    print("| A)", 164, 129, font_color);
    print("Action", 182, 129, font_color, false, 1, true);
    print("B)", 210, 129, font_color);
    print("Look", 222, 129, font_color, false, 1, true);

    //Dialog test
    /*
    rect(28, 43, 180, 20, 0);
    print("Gordo rata, gordo rata", 30, 45, 15, false, 1);
    print("Recatate y devolvememe la garrafaa", 30, 53, 15, false, 1);
    */
}
