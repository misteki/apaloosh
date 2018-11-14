//  *GLOBALS    //
let $t: number = 0;
let $dt: number = 0;
let $input_manager;

const init: () => void = () => {
    const pc = create_pc(15, 20);
    const npcs = [
        create_actor(42, 25, 261),
        create_actor(32, 24, 262),
        create_actor(30, 28, 268),
        create_actor(38, 20, 276),
    ];

    //Create map
    const tileset = create_tileset();

    add_tiles_flag(tileset, TileFlags.SOLID, [3, 6, 7, 8, 18, 19, 22, 23, 24, 28, 29, 38, 39, 40, 54, 55, 56, 70, 72, 86, 87, 88]);

    add_tiles_flag(tileset, TileFlags.OPAQUE, [1, 3, 11, 12]);
    const map = create_tilemap(0, 0, 31, 17, tileset);
    const pc_moved = false;

    // Camera
    const camera = create_camera(pc.map_x, pc.map_y, 31, 17, 15, 7);

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
    const input = get_input();
    //PC movement
    const direction: Direction = is_pressed(input, Button.LEFT) ? Direction.LEFT : (is_pressed(input, Button.RIGHT) ? Direction.RIGHT : (is_pressed(input, Button.UP) ? Direction.UP : (is_pressed(input, Button.DOWN) ? Direction.DOWN : Direction.NONE)));
    pc.movement.direction = direction;

    // -------------------- LOGIC -------------------- 
    update_pc(pc, $dt, state);
    if (state.pc_moved) {
        update_camera_fov(state.camera);
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
    [...npcs, pc].forEach((actor) => draw_actor(actor, camera));

    // STATUS PANEL
    rect(0, 128, 240, 8, 8);
    spr(510, 160, 128);
    spr(495, 168, 128);
    spr(479, 176, 128);
    spr(463, 184, 128);
    print("Explore", 198, 129, 14, false, 1, false);
    print("Misteki", 1, 130, 14, false, 1, false);
}
