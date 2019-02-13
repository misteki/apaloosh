/** Helper methods for points. */
const create_point = (x, y) => ({ x, y });

/** Helper methods for lines. */
const create_line = (p, q) => ({ p, q });
const copy_line = (l) => ({ ...l });
const line_cw = (line, pt) => line_dtheta(line, pt) > 0;
const line_ccw = (line, pt) => line_dtheta(line, pt) < 0;
const line_dtheta = (line, pt) => {
    const theta = Math.atan2(line.q.y - line.p.y, line.q.x - line.p.x),
        other = Math.atan2(pt.y - line.p.y, pt.x - line.p.x),
        dt = other - theta;
    return ((dt > -Math.PI) ? dt : (dt + 2 * Math.PI)).toFixed(5);
}

/** Helper methods for arcs. */
const create_arc = (steep, shallow) => ({
    steep, shallow,
    steepbumps: [],
    shallowbumps: [],
});

const copy_arc = (a) => {
    var c = create_arc(copy_line(a.steep), copy_line(a.shallow));
    for (let i in a.steepbumps) {
        c.steepbumps.push({ ...a.steepbumps[i] });
    }
    for (let i in a.shallowbumps) {
        c.shallowbumps.push({ ...a.shallowbumps[i] });
    }
    return c;
}

const arc_hits = (a, pt) => (line_ccw(a.steep, create_point(pt.x + 1, pt.y)) &&
    line_cw(a.shallow, create_point(pt.x, pt.y + 1)));

const arc_bump_cw = (a, pt) => {
    // Steep bump.
    const sb = create_point(pt.x + 1, pt.y);
    a.steepbumps.push(sb);
    a.steep.q = sb;
    for (let i in a.shallowbumps) {
        const b = a.shallowbumps[i];
        if (line_cw(a.steep, b)) { a.steep.p = b; }
    }
}

const arc_bump_ccw = (a, pt) => {
    const sb = create_point(pt.x, pt.y + 1);
    a.shallowbumps.push(sb);
    a.shallow.q = sb;
    for (let i in a.steepbumps) {
        const b = a.steepbumps[i];
        if (line_ccw(a.shallow, b)) { a.shallow.p = b; }
    }
};

const arc_shade = (arc, pt) => {
    const steepBlock = line_cw(arc.steep, create_point(pt.x, pt.y + 1)),
        shallowBlock = line_ccw(arc.shallow, create_point(pt.x + 1, pt.y));
    if (steepBlock && shallowBlock) {
        // Completely blocks this arc.
        return [];
    } else if (steepBlock) {
        // Steep bump.
        arc_bump_cw(arc, pt);
        return [arc];
    } else if (shallowBlock) {
        // Shallow bump.
        arc_bump_ccw(arc, pt);
        return [arc];
    } else {
        // Splits this arc in twain.
        const a = copy_arc(arc);
        const b = copy_arc(arc);
        arc_bump_cw(a, pt);
        arc_bump_ccw(b, pt);
        return [a, b];
    }
}

/** Helper methods for a collection of arcs covering a quadrant. */
const create_light = (radius) => {
    var wide = create_arc(
        create_line(create_point(1, 0), create_point(0, radius)),
        create_line(create_point(0, 1), create_point(radius, 0)));
    return {
        arcs: [wide]
    };
}

const light_hits = (light, pt) => {
    for (let i in light.arcs) {
        // Cannot just return i, in case it's zero.
        if (arc_hits(light.arcs[i], pt)) { return { i: i }; }
    }
    return false;
}

const light_shade = (light, arci, pt) => {
    const arc = light.arcs[arci.i],
        splice = light.arcs.splice;
    // Shade the arc with this point, replace it with new arcs (or none).
    splice.apply(light.arcs, [arci.i, 1].concat(arc_shade(arc, pt)));
    return light.arcs.length > 0;
}

/** Compute the field of view from (ox, oy) out to radius r. */
const field_of_view = (ox, oy, r, x_limit, y_limit, visit, blocked) => {
    const start_time = time();
    visit(ox, oy); // origin always visited.

    const quadrant = (dx, dy) => {
        const light = create_light(r);
        for (let dr = 1; dr <= r; dr += 1) {
            let dr_ops = 0;
            for (let i = 0; i <= dr; i++) {
                if (dr - i < x_limit && i < y_limit) {
                    dr_ops++;
                    // Check for light hitting this cell.
                    const cell = create_point(dr - i, i),
                        arc = light_hits(light, cell);
                    if (!arc) { continue; }  // unlit

                    // Show the lit cell, check if blocking.
                    const ax = ox + cell.x * dx,
                        ay = oy + cell.y * dy;
                    visit(ax, ay);
                    if (!blocked(ax, ay)) { continue; }  // unblocked

                    // Blocking cells cast shadows.
                    if (!light_shade(light, arc, cell)) { return; }  // no more light
                }
            }
            if (dr_ops === 0) {
                return;
            }
        }
    }

    quadrant(-1, +1);
    quadrant(+1, +1);
    quadrant(-1, -1);
    quadrant(+1, -1);
}

const create_field_of_view = (radius, x_length, y_length, fog = null) => ({
    visible_map: [],
    discovered_map: [],
    radius,
    x_length,
    y_length,
    fog
});

const update_fov = (fov, map, pov_x, pov_y) => {
    const { discovered_map, radius, x_length, y_length } = fov;
    const fov_map = [];
    //Cast rays
    const place_map_flag = (map, x, y, value) => {
        if (!map[x]) {
            map[x] = [];
        }
        if (!map[x][y]) {
            map[x][y] = value;
        }
    }

    /* Permissive fov to update visibility maps */
    field_of_view(pov_x, pov_y, radius, x_length, y_length,
        (x, y) => {
            place_map_flag(discovered_map, x, y, true);
            place_map_flag(fov_map, x, y, true);
        },
        (x, y) => {
            return tile_has_flag(get_tile(map, x, y), [TileFlags.OPAQUE]);
        },
    );
    fov.visible_map = fov_map;
}

const draw_fog = (fov, map, camera) => {
    // Paint fog
    if (fov.fog) {
        const { x: c_x, y: c_y } = camera;
        const { discovered_map, visible_map, fog } = fov;
        const { full_fog_sprite_id, partial_fog_sprite_id, fog_sprite_colorkey } = fog;
        const map_x = Math.floor(c_x / TILE_SIZE);
        const map_y = Math.floor(c_y / TILE_SIZE);
        const map_offset_x = map.x - (c_x % TILE_SIZE);
        const map_offset_y = map.y - (c_y % TILE_SIZE);
        // +1 added to height and width to account for newly explored tiles while moving
        for (let x = map_x; x < map_x + camera.width + 1; x++) {
            for (let y = map_y; y < map_y + camera.height + 1; y++) {
                const screen_x = map_offset_x + (x - map_x) * TILE_SIZE;
                const screen_y = map_offset_y + (y - map_y) * TILE_SIZE;
                const is_visible = visible_map[x] && visible_map[x][y];
                const is_discovered = discovered_map[x] && discovered_map[x][y];
                if (!is_visible) {
                    if (is_discovered) {
                        spr(partial_fog_sprite_id, screen_x, screen_y, fog_sprite_colorkey);
                    } else {
                        spr(full_fog_sprite_id, screen_x, screen_y, fog_sprite_colorkey);
                    }
                }
            }
        }
    }
};
