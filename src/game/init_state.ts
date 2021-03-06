const init_game_state = () => {
    const pc = create_pc(46, 48);
    const npcs = [
        create_npc(37, 23, create_sprite(265)),
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
    const fov_radius = 22;
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

    const input_context = 'MOVING';
    const ui = {
    }

    return {
        pc, npcs, camera, map, turn_system, status_bar, input_context, ui,
    }
}