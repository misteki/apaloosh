const TILESET_DATA = {
    1: {
        flags: [TileFlags.SOLID, TileFlags.OPAQUE, TileFlags.OPENABLE],
        event_handlers: { [TileEvents.OPEN]: (map_x, map_y) => { mset(map_x, map_y, 17) } }
    },
    3: {
        flags: [TileFlags.SOLID, TileFlags.OPAQUE]
    },
    5: {
        flags: [TileFlags.SOLID, TileFlags.OPAQUE]
    },
    7: {
        flags: [TileFlags.SOLID, TileFlags.OPAQUE]
    },
    17: {
        flags: [TileFlags.CLOSABLE],
        event_handlers: { [TileEvents.CLOSE]: (map_x, map_y) => { mset(map_x, map_y, 1) } }
    },
    21: {
        flags: [TileFlags.SOLID, TileFlags.OPAQUE]
    },
    22: {
        flags: [TileFlags.SOLID, TileFlags.OPAQUE]
    },
    23: {
        flags: [TileFlags.SOLID, TileFlags.OPAQUE]
    },
    24: {
        flags: [TileFlags.SOLID, TileFlags.OPAQUE]
    },
    39: {
        flags: [TileFlags.SOLID, TileFlags.OPAQUE]
    },
};