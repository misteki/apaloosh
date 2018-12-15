//  TIC80 GLOBALS  //
const SCREEN_WIDTH: number = 240;
const SCREEN_HEIGHT: number = 136;
const DEFAULT_MEMORY_BANK: number = 0;
const WORLD_LEVELS = 64;

// TILEMAP //
enum TileFlags {
    SOLID,
    OPAQUE,
    FREEZING
};
const TILE_SIZE: number = 8;
const WORLD_WIDTH: number = 8;

// MOVEMENT //
enum Direction { NONE, UP, DOWN, LEFT, RIGHT };

// UI //
const PANEL = {
    OUTER_BORDER_COLOR: 14,
    INNER_BORDER_COLOR: 9,
    BACKGROUND_COLOR: 0,
    PLAYER_NAME_COLOR: 15,
    HP_COLOR: 7,
    ACTIONS_BACKGROUND_COLOR: 14,
};