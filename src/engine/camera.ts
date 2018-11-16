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
    const paths = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let count = 0;
    // Build checklist
    const cells_to_check = [];
    for (let x = camera_x_origin; x < camera_x_origin + width; x++) {
        cells_to_check.push([x, camera_y_origin]);
        cells_to_check.push([x, camera_x_origin + width]);
    };
    for (let y = camera_y_origin + 1; y < camera_y_origin + height - 1; y++) {
        cells_to_check.push([camera_x_origin, y]);
        cells_to_check.push([camera_x_origin + width, y]);
    }
    trace(cells_to_check.toString());

    //Cast rays
    const place_fov_flag = (x, y, value) => {
        if (!fov_map[x]) {
            fov_map[x] = [];
        }
        if (fov_map[x][y] === undefined) {
            fov_map[x][y] = value;
        }
    }
    cells_to_check.forEach(cell => {
        const goal_x = cell[0];
        const goal_y = cell[1]
        let path_x = pov_x;
        let path_y = pov_y;
        let visible = true;
        let count = 0;
        trace('ray!');
        trace(`goal: ${goal_x},${goal_y}`)
        while (path_x !== goal_x || path_y !== goal_y) {
            const distances = paths
                .map(path => [...path, get_linear_distance(goal_x, goal_y, path_x + path[0], path_y + path[1])])
                .sort((a, b) => a[2] - b[2]);
            const shortest = distances[0];

            trace(`${path_x}, ${path_y}`);
            if (!visible) {
                place_fov_flag(path_x, path_y, false);
            } else {
                if (get_tile(map, path_x, path_y).flags[TileFlags.OPAQUE]) {
                    trace(`opaque at ${path_x}, ${path_y}`)
                    place_fov_flag(path_x, path_y, true);
                    visible = false;
                } else {
                    place_fov_flag(path_x, path_y, true);
                }
            }
            path_x = path_x + shortest[0];
            path_y = path_y + shortest[1];
            count++;
        }
    });
    fov_map[pov_x][pov_y] = true;
    //Build fovmap
    /*
    for (let x = camera_x_origin; x < camera_x_origin + width; x++) {
        fov_map[x] = [];
        for (let y = camera_y_origin; y < camera_y_origin + height; y++) {
            fov_map[x][y] = true;
        }
    };
    */

    return fov_map;
}

const update_camera_fov = (camera, map) => {
    const { x, y, width, height, center } = camera;
    camera.fov_map = get_fov_map(map, x, y, width, height, center.x, center.y);
}