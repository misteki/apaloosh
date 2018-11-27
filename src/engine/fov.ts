/** Compute the field of view from (ox, oy) out to radius r. */
const permissive_fov = (ox, oy, r, visit, blocked) => {
    visit(ox, oy); // origin always visited.

    const quadrant = (dx, dy) => {
        const light = create_light(r);
        for (let dr = 1; dr <= r; dr += 1) {
            for (let i = 0; i <= dr; i++) {
                // Check for light hitting this cell.
                const cell = create_point(dr - i, i);
                trace(`cell: x ${cell.x}, y: ${cell.y}`);
                const arc = light_hits(cell, light);
                if (!arc) {
                    //trace('no arc!');
                    continue;
                }  // unlit

                // Show the lit cell, check if blocking.
                const ax = ox + cell.x * dx,
                    ay = oy + cell.y * dy;
                visit(ax, ay);
                if (!blocked(ax, ay)) { continue; }  // unblocked

                // Blocking cells cast shadows.
                if (!light_shade(arc, cell, light)) { return; }  // no more light
            }
        }
    }

    quadrant(-1, +1);
    quadrant(+1, +1);
    quadrant(-1, -1);
    quadrant(+1, -1);
    trace('end quads');
}

/** Helper methods for points. */
const create_point = (x, y) => ({ x, y });
const copy_point = (point) => ({ ...point });

/** Helper methods for lines. */
const create_line = (p, q) => ({ p, q });
const copy_line = (line) => ({ ...line });
const line_cw = (pt, line) => { return line_dtheta(pt, line) > 0; };
const line_ccw = (pt, line) => { return line_dtheta(pt, line) < 0; }
const line_dtheta = (pt, line) => {
    const theta = Math.atan2(line.q.y - line.p.y, line.q.x - line.p.x),
        other = Math.atan2(pt.y - line.p.y, pt.x - line.p.x),
        dt = other - theta;
    return ((dt > -Math.PI) ? dt : (dt + 2 * Math.PI)).toFixed(5);
}

/** Helper methods for arcs. */
const create_arc = (steep, shallow) => {
    return {
        steep,
        shallow,
        steepbumps: [],
        shallowbumps: []
    }
}

const copy_arc = (arc) => {
    const c = arc(copy_arc(arc.steep), copy_arc(arc.shallow));
    for (let i in arc.steepbumps) {
        c.steepbumps.push(copy_arc(arc.steepbumps[i]));
    }
    for (let i in arc.shallowbumps) {
        c.shallowbumps.push(copy_arc(arc.shallowbumps[i]));
    }
    return c;
}

const arc_hits = (pt, arc) => {
    return (arc.steep.ccw(create_point(pt.x + 1, pt.y)) &&
        arc.shallow.cw(create_point(pt.x, pt.y + 1)));
}

/** Bump this arc clockwise (a steep bump). */
const arc_bump_cw = function (pt, arc) {
    // Steep bump.
    const sb = create_point(pt.x + 1, pt.y);
    arc.steepbumps.push(sb);
    arc.steep.q = sb;
    for (let i in arc.shallowbumps) {
        const b = arc.shallowbumps[i];
        if (line_cw(b, arc.steep)) { arc.steep.p = b; }
    }
}

/** Bump this arc counterclockwise (a shallow bump). */
const arc_bump_ccw = function (pt, arc) {
    const sb = create_point(pt.x, pt.y + 1);
    arc.shallowbumps.push(sb);
    arc.shallow.q = sb;
    for (let i in arc.steepbumps) {
        const b = arc.steepbumps[i];
        if (line_ccw(b, arc.shallow)) { arc.shallow.p = b; }
    }
}

const arc_shade = function (pt, arc) {
    const steepBlock = line_cw(create_point(pt.x, pt.y + 1), arc.steep),
        shallowBlock = line_ccw(create_point(pt.x + 1, pt.y), arc.shallow);
    if (steepBlock && shallowBlock) {
        // Completely blocks this arc.
        return [];
    } else if (steepBlock) {
        // Steep bump.
        arc_bump_cw(pt, arc);
        return [arc];
    } else if (shallowBlock) {
        // Shallow bump.
        arc_bump_ccw(pt, arc);
        return [arc];
    } else {
        // Splits this arc in twain.
        const a = copy_arc(arc), b = copy_arc(b);
        arc_bump_cw(pt, a);
        arc_bump_ccw(pt, b);
        return [a, b];
    }
}

/** Helper methods for a collection of arcs covering a quadrant. */
const create_light = (radius) => {
    const wide = create_arc(
        create_line(create_point(1, 0), create_point(0, radius)),
        create_line(create_point(0, 1), create_point(radius, 0)));
    return [wide];
}

const light_hits = (pt, arcs) => {
    for (let i in arcs) {
        //trace(`an arc! ${i}`)
        // Cannot just return i, in case it's zero.
        if (light_hits(pt, arcs[i])) {
            return { i };
        }
    }
    return false;
}

const light_shade = function (arci, pt, arcs) {
    const arc = arcs[arci.i],
        splice = arcs.splice;
    // Shade the arc with this point, replace it with new arcs (or none).
    //splice.apply(this.arcs, [arci.i, 1].concat(arc.shade(pt))); //wat
    return arcs.length > 0;
}