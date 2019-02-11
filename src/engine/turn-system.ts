enum TurnSystemState {
    ROUND_START,
    PC_TURN,
    NPC_TURNS_START,
};

const start_turn = (actor) => {
    const { stats } = actor;
    const speed_divider = 4;
    const ap_base = 0.5
    const { speed } = stats;
    const current_ap = ap_base + speed / speed_divider;
    stats.ap = Math.floor(stats.leftover_ap + current_ap);
    stats.leftover_ap = stats.leftover_ap + current_ap - stats.ap;
}

const update_turn_round = (input, state) => {
    const { pc, npcs, turn_system } = state;
    if (turn_system.state === TurnSystemState.ROUND_START) {
        turn_system.processing = false;
        start_turn(pc);
        turn_system.state = TurnSystemState.PC_TURN;
    }
    if (turn_system.state === TurnSystemState.PC_TURN) {
        if (!turn_system.processing && pc.stats.ap > 0) {
            //Process input
            const direction: Direction = is_pressed(input, Button.LEFT) ? Direction.LEFT : (is_pressed(input, Button.RIGHT) ? Direction.RIGHT : (is_pressed(input, Button.UP) ? Direction.UP : (is_pressed(input, Button.DOWN) ? Direction.DOWN : Direction.NONE)));
            pc.movement.direction = direction;
            step_pc(pc, state);
        } else {
            update_fov(state.camera.fov, state.map, pc.map_x, pc.map_y);
            if (pc.stats.ap === 0) {
                turn_system.state = TurnSystemState.NPC_TURNS_START;
                turn_system.processing = true;
            }
        }
    }
    if (turn_system.state === TurnSystemState.NPC_TURNS_START) {
        npcs.forEach(npc => {
            start_turn(npc);
            while (npc.stats.ap > 0) {
                step_npc(npc, state);
            }
        });
        turn_system.state = TurnSystemState.ROUND_START;
    }
}