//  *GLOBALS    //
let $t: number = 0;
let $dt: number = 0;
let $input_manager;
let state;

function TIC() {
    // -------------------- INIT --------------------
    if ($t === 0) {
        state = init_game_state();
    }
    const start_time = time();

    const { pc, npcs, turn_system, input_context, ui } = state;

    // -------------------- TIMER UPDATES --------------------
    const nt: number = time();
    $dt = (nt - $t) / 1000;
    $t = nt;

    // -------------------- INPUT -------------------- 
    const input = get_input(false);

    // -------------------- LOGIC --------------------
    if (input_context === 'MOVING') {
        update_turn_round(input, state);
        //Update logic
        update_pc(pc, $dt, state);
        if (!turn_system.processing) {
            npcs.forEach((npc) => {
                update_npc(npc, $dt, state);
            });
        }
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
}
