const create_camera = (map_center_x, map_center_y, width, height, map) => {
    const screen_x = (map_center_x - Math.floor(width / 2)) * TILE_SIZE;
    const screen_y = (map_center_y - Math.floor(height / 2)) * TILE_SIZE;
    const discovered_map = [];
    for (let x = 0; x < map.width; x++) {
        discovered_map[x] = [];
        for (let y = 0; y < map.height; y++) {
            discovered_map[x][y] = false;
        }
    }
    return {
        x: screen_x,
        y: screen_y,
        width,
        height,
        fov_map: [],
        discovered_map
    };
}

const bresenham = (x1, y1, x2, y2) => {
    const coordinatesArray = [];
    // Translate coordinates
    // Define differences and error check
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = (x1 < x2) ? 1 : -1;
    const sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;
    // Set first coordinates
    //coordinatesArray.push({ x: x1, y: y1 });
    // Main loop
    while (!((x1 == x2) && (y1 == y2))) {
        const e2 = err << 1;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
        // Set coordinates
        coordinatesArray.push({ x: x1, y: y1 });
    }
    // Return the result
    return coordinatesArray;
}

const update_camera_fov = (camera, map, pov_x, pov_y) => {
    const { discovered_map } = camera;
    trace('FOV CALCUALTION!');
    const init_time = time();
    const fov_map = [];
    //Cast rays
    const place_fov_flag = (x, y, value) => {
        if (!fov_map[x]) {
            fov_map[x] = [];
        }
        if (!fov_map[x][y]) {
            fov_map[x][y] = value;
        }
    }
    /*

place_fov_flag(pov_x, pov_y, true);

const edge_cells = [];
for (let x = camera_x_origin; x < camera_x_origin + width; x++) {
if (x === camera_x_origin || x === camera_x_origin + width - 1) {
    for (let y = camera_y_origin; y < camera_y_origin + height; y++) {
        edge_cells.push({ x, y });
    }
} else {
    edge_cells.push({ x, y: camera_y_origin });
    edge_cells.push({ x, y: camera_y_origin + height });
}
}
edge_cells.forEach(cell => {
const line = bresenham(pov_x, pov_y, cell.x, cell.y);
let ray_visible = true;
line.forEach(point => {
    if (ray_visible) {
        place_fov_flag(point.x, point.y, true);
        if (get_tile(map, point.x, point.y).flags[TileFlags.OPAQUE]) {
            ray_visible = false;
        }
    } else {
        place_fov_flag(point.x, point.y, false);
    }
})
})
*/

    /* test permissive fov */
    fieldOfView(pov_x, pov_y, 10,
        (x, y) => { discovered_map[x][y] = true; place_fov_flag(x, y, true) },
        (x, y) => { return get_tile(map, x, y).flags[TileFlags.OPAQUE] },
    );
    trace(`took: ${time() - init_time}`);
    camera.fov_map = fov_map;
}