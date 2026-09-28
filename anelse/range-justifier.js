var store = {}; // key->value storage, example: "core.js"->[1,50,90,120]
function justifyRange(file, start, end) {
    if (end < start || start < 1)
        return [];
    var knots = store[file];
    if (!knots) {
        store[file] = [start, end];
        return [[start, end]];
    }
    var beginning = start-1;
    var ending = end+1;
    if (ending < knots[0]) {
        store[file] = [start, end, ...knots];
        return [[start, end]];
    }
    var len = knots.length;
    if (knots[len-1] < beginning) {
        store[file] = [...knots, start, end];
        return [[start, end]];
    }
    var newls = [];
    var dirt = [];
    var out = [];
    var reading = 0;
    for (var i = 0; i < len; i+=2) {
        var iopen = knots[i];
        var iclose = knots[i+1];
        if (2 == dirt.length) {
            newls = [...newls, iopen, iclose];
            continue;
        }
        if (iclose < beginning) {
            newls = [...newls, iopen, iclose];
            continue;
        }
        if (Math.abs(iopen - end) < 2) { // tail collision
            if (!dirt.length) {
                dirt.push(start);
                reading = [start];
            }
            dirt.push(iclose);
            newls = [...newls, ...dirt];
            if (reading) {
                reading.push(iopen - 1);
                out.push(reading);
                reading = 0;
            }
            continue;
        }
        if (Math.abs(iopen - start) < 2) { // upper double gasket
            if (start < iopen) {
                out.push([start, start]);
                dirt.push(start);
            } else
                dirt.push(iopen);
        } else {
            if (end < iopen) {
                if (!dirt.length) {
                    dirt.push(start);
                    reading = [start];
                }
                dirt.push(end);
                newls = [...newls, ...dirt, iopen, iclose];
                if (reading) {
                    reading.push(end);
                    out.push(reading);
                    reading = 0;
                }
                continue;
            }
            if (iopen < start)
                dirt.push(iopen);
            else {
                if (!dirt.length) {
                    dirt.push(start);
                    out.push([start, iopen - 1]);
                } else if (reading) {
                    reading.push(iopen - 1);
                    out.push(reading);
                    reading = 0;
                }
            }
        }
        if (Math.abs(iclose - start) < 2) { // head collision
            reading = [iclose + 1];
            dirt.push(iopen);
            continue;
        }
        if (Math.abs(iclose - end) < 2) { // lower double gasket
            if (iclose < end) {
                out.push([end, end]);
                var nopen = knots[i+2];
                if (nopen == ending) { // double gasket + tail collision
                    dirt.push(knots[i+3]);
                    i+=2;
                    continue;
                }
                dirt.push(end);
            } else
                dirt.push(iclose);
            continue;
        }
        if (iclose < end) {
            reading = [iclose + 1];
        } else {
            dirt.push(iclose);
            newls = [...newls, ...dirt];
        }
    }
    if (2 != dirt.length) {
        dirt.push(end);
        newls = [...newls, ...dirt];
    }
    if (reading) {
        reading.push(end);
        out.push(reading);
    }
    store[file] = newls;
    return out;
}
