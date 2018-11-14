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

//MOVEMENT//
enum Direction { NONE, UP, DOWN, LEFT, RIGHT };
