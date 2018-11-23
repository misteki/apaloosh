const create_camera = (init_x, init_y, width, height, center_x, center_y, map) => {
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
        fov_map: get_fov_map(map, camera_x, camera_y, width, height, center_x, center_y)
    };
}
/*
for (let x = camera_x_origin; x < camera_x_origin + width; x++) {
        const row = [];
        for (let y = camera_y_origin; y < camera_y_origin + height; y++) {
            let path_x = x;
            let path_y = y;
            let visible = true;
            trace(`goal:${pov_x},${pov_y}++++++++++++++++++++++++++++++++++++++`)
            while (visible && path_x !== pov_x && path_y !== pov_y) {
                trace(`prev:${path_x},${path_y}`)
                const distances = paths
                    .map(path => [...path, get_linear_distance(pov_x, pov_y, path_x + path[0], path_y + path[1])])
                    .sort((a, b) => a[2] - b[2]);
                const shortest = distances[0];
                if (get_tile(map, path_x + shortest[0], path_y + shortest[1]).flags[TileFlags.OPAQUE]) {
                    visible = false;
                } else {
                    path_x = path_x + shortest[0];
                    path_y = path_y + shortest[1];
                }
                trace(`post: ${path_x},${path_y}`)
                count++;
            }
            row.push(visible); //replace by visible
        }
        fov_map.push(row);
    };
*/

const get_fov_map = (map, origin_x, origin_y, width, height, center_x, center_y) => {
    const get_linear_distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    const fov_map = [];
    const camera_x_origin = Math.floor(origin_x / TILE_SIZE);
    const camera_y_origin = Math.floor(origin_y / TILE_SIZE);
    const pov_x = camera_x_origin + center_x;
    const pov_y = camera_y_origin + center_y;
    const max_distance = 10;
    //const max_distance_y = 8;
    //Cast rays
    const place_fov_flag = (x, y, value) => {
        if (!fov_map[x]) {
            fov_map[x] = [];
        }
        if (fov_map[x][y] === undefined) {
            fov_map[x][y] = value;
        }
    }
    place_fov_flag(pov_x, pov_y, true);
    const octant_visibility = [true, true, true, true, true, true, true, true];
    for (var row = 1; row < max_distance; row++) {
        for (var col = 0; col <= row; col++) {
            const octants = [[row, col], [-row, col], [row, -col], [-row, -col], [col, row], [-col, row], [col, -row], [-col, -row]];
            octants.forEach((o, o_index) => {
                const x = pov_x + o[0];
                const y = pov_y + o[1];
                trace(`calculate: ${x},${y}`)
                if (!octant_visibility[o_index]) {
                    trace('folse!');
                    place_fov_flag(x, y, false);
                } else {
                    place_fov_flag(x, y, true);
                }
                if (get_tile(map, x, y).flags[TileFlags.OPAQUE]) {
                    trace('opaque');
                    octant_visibility[o_index] = false;
                }
            });
        }
    }

    return fov_map;
}

const update_camera_fov = (camera, map) => {
    const { x, y, width, height, center } = camera;
    camera.fov_map = get_fov_map(map, x, y, width, height, center.x, center.y);
}