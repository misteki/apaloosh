    /*
if (turn_system.state === 'NPC_TURN_START') {
    turn_system.state = 'NPC_TURN';
    if (turn_system.current_npc_index < npcs.length) {
        const npc = npcs[turn_system.current_npc_index];
        start_turn(npc);
    } else {
        turn_system.state = 'ROUND_START';
    }
}
if (turn_system.state === 'NPC_TURN') {
    if (turn_system.current_npc_index < npcs.length) {
        const npc = npcs[turn_system.current_npc_index];
        if (npc.stats.ap > 0) {
            step_npc(npc, state);
        } else {
            if (npc.stats.ap === 0) {
                if (turn_system.current_npc_index < npcs.length) {
                    turn_system.current_npc_index = turn_system.current_npc_index + 1;
                    turn_system.state = 'NPC_TURN_START';
                } else {
                    turn_system.state = 'ROUND_START';
                }
            }
        }
    } else {
        turn_system.state = 'ROUND_START';
    }
}
*/