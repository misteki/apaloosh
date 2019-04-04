const create_cursor = (x, y, visible = false, cursor_sprite = 0) => ({
    x,
    y,
    visible,
    sprite: create_sprite(cursor_sprite)
});