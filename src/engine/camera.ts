const create_camera = (init_x, init_y, width, height, center_x, center_y) => {
    const camera_x = (init_x - center_x) * TILE_SIZE;
    const camera_y = (init_y - center_y) * TILE_SIZE;
    return {
        x: camera_x,
        y: camera_y,
        center: {
            x: center_x,
            y: center_y
        },
        width,
        height,
        fov_map: get_fov_map(camera_x, camera_y, width, height, center_x, center_y)
    };
}

const get_fov_map = (origin_x, origin_y, width, height, center_x, center_y) => {
    const get_linear_distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    const fov_map = [];
    const camera_x_origin = Math.floor(origin_x / TILE_SIZE);
    const camera_y_origin = Math.floor(origin_y / TILE_SIZE);

    for (let i = camera_x_origin; i < camera_x_origin + width; i++) {
        const row = [];
        for (let j = camera_y_origin; j < camera_y_origin + height; j++) {
            const visible = get_linear_distance(camera_x_origin + center_x, camera_y_origin + center_y, i, j) < 15.5;
            row.push(visible);
        }
        fov_map.push(row);
    };
    return fov_map;
}

const update_camera_fov = (camera) => {
    const { x, y, width, height, center } = camera;
    camera.fov_map = get_fov_map(x, y, width, height, center.x, center.y);
}