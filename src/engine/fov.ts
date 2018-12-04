/** Compute the field of view from (ox, oy) out to radius r. */
const field_of_view = (ox, oy, r, x_limit, y_limit, visit, blocked) => {
    visit(ox, oy); // origin always visited.

    const quadrant = (dx, dy) => {
        const light = create_light(r);
        for (let dr = 1; dr <= r; dr += 1) {
            for (let i = 0; i <= dr; i++) {
                if (dr - i < x_limit && i < y_limit) {
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
        }
    }

    quadrant(-1, +1);
    quadrant(+1, +1);
    quadrant(-1, -1);
    quadrant(+1, -1);
}

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
