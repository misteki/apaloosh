const create_camera = (map_center_x, map_center_y, width, height, fov = null) => {
    const screen_x = (map_center_x - Math.floor(width / 2)) * TILE_SIZE;
    const screen_y = (map_center_y - Math.floor(height / 2)) * TILE_SIZE;
    return {
        x: screen_x,
        y: screen_y,
        width,
        height,
        fov
    };
}