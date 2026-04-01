var ctx = {};
var verbose = 0;
var cid = 0;
verbose && console.log("__[o0] i'm in");
var keys = {
    up:    function(){return {code:"ArrowUp",   key:"ArrowUp",   keyCode:38,which:38,bubbles:true}},
    down:  function(){return {code:"ArrowDown", key:"ArrowDown", keyCode:40,which:40,bubbles:true}},
    left:  function(){return {code:"ArrowLeft", key:"ArrowLeft", keyCode:37,which:37,bubbles:true}},
    right: function(){return {code:"ArrowRight",key:"ArrowRight",keyCode:39,which:39,bubbles:true}},
    kO: function(){return {code:"KeyO",key:"o",keyCode:79,which:79,bubbles:true}},
    kP: function(){return {code:"KeyP",key:"p",keyCode:80,which:80,bubbles:true}},
    kN: function(){return {code:"KeyN",key:"n",keyCode:78,which:78,bubbles:true}},
    kS: function(){return {code:"KeyS",key:"s",keyCode:83,which:83,bubbles:true}},
    kT: function(){return {code:"KeyT",key:"t",keyCode:84,which:84,bubbles:true}},
    kB: function(){return {code:"KeyB",key:"b",keyCode:66,which:66,bubbles:true}},
    kM: function(){return {code:"KeyM",key:"m",keyCode:77,which:77,bubbles:true}},
    void:  {}
};

function runControl(payload, num) {
    if (ctx.cmds)
        return verbose && console.warn("__[xx] busy");
    if (payload == "ibks") {
        ctx.num = +num;
        return browser.storage.local.get("cmds").then(runControl);
    }
    var cmds = payload.cmds || [];
    cmds = cmds[ctx.num - 1];
    verbose && console.log(" __ execute: ", ctx.num);
    if (!cmds) {
        verbose && console.warn(" .. load default commands!");
        cmds = "uudd" ;
    }
    ctx = { cmds: cmds, idx: 0, round: readReps(cmds) };
    verbose && console.log("1 sec ...");
    return cmds.charAt(0) == '?'
        ? proll()
        : cid = setTimeout(roll, 500);
}

function readReps(cmds) {
    var buf = "";
    for (var i = 0; i < cmds.length; i++) {
        var c = cmds.charAt(i);
        if (c == '?') continue;
        if (c < '0' || c > '9') break;
        buf += c;
    }
    verbose && console.warn(">> load rounds: ", buf);
    if (!buf)
        return 1;
    return +buf;
}

function roll() {
    if (ctx.fn) {
        var lfn = ctx.fn;
        ctx.fn = 0;
        return (cid = setTimeout(roll, lfn()));
    }
    if (!ctx.cmds) {
        return verbose && console.log(" .. cancelled!");
    }
    var p = 0;
    for (var i = ctx.idx; i < ctx.cmds.length; i++) {
        p = digest(ctx.cmds.charAt(i), i);
        if (p)
            break;
    }
    if (!p) {
        ctx.round--;
        if (ctx.round == 0) {
            verbose && console.log(" << round exhausted!");
            ctx = {};
        } else {
            ctx.idx = 0;
            cid = setTimeout(roll, 250);
            verbose && console.log(" .. round left: ", ctx.round);
        }
        return
    }
    ctx.idx = p.i;
    p.subFn && (ctx.fn = p.subFn);
    if (!p.fn)
        return
    var out = p.fn();
    if ("number" == (typeof out)) {
        cid = setTimeout(roll, out);
        if (out < 200)
            cid = 0;
        return
    }
    out.then(roll);
}

function digest(d, i) {
    var synev, waitSig, kpSig, invC, cev;
    synev = waitSig = kpSig = invC = cev = 0;
    switch (d) {
        case "u":
            synev = keys.up(); break;
        case "d":
            synev = keys.down(); break;
        case "l":
            synev = keys.left(); break;
        case "r":
            synev = keys.right(); break;

        case "w":
            waitSig = 1; break;
        case "k":
            kpSig = 1; break;
        case "i":
            invC = 1; break;

        case "U":
            cev = keys.up(); break;
        case "D":
            cev = keys.down(); break;
        case "L":
            cev = keys.left(); break;
        case "R":
            cev = keys.right(); break;

        default:
            break;
    }
    if (synev)
        return { fn: press(synev), subFn: release(synev), i: i+1 };
    if (waitSig) {
        var ni = i+1;
        var nc = ctx.cmds.charAt(ni);
        var sec = "";
        var l = 0;
        while ("0" <= nc && nc <= "9" && l < 5) {
            sec += nc;
            ni++;
            nc = ctx.cmds.charAt(ni);
            l++;
        }
        if (sec)
            return { fn: idle(sec), i: ni };
    }
    if (kpSig) {
        var kev = 0;
        switch(ctx.cmds.charAt(i+1)) {
            case "o":
                kev = keys.kO(); break;
            case "p":
                kev = keys.kP(); break;
            case "n":
                kev = keys.kN(); break;
            case "s":
                kev = keys.kS(); break;
            case "t":
                kev = keys.kT(); break;
            case "b":
                kev = keys.kB(); break;
            case "m":
                kev = keys.kM(); break;
            default:
                break;
        }
        if (kev)
            return { fn: press(kev), subFn: release(kev), i: i+2 };
    }
    if (invC)
        return { fn: invClick(ctx.cmds.charAt(i+1)), i: i+2 };
    if (cev)
        return { fn: shiftPress(cev), i: i+1 };
}

function press(synev) {
    return function() {
        verbose && console.log("_ press: ", synev.key);
        document.body.dispatchEvent(new KeyboardEvent("keydown", synev));
        return pickin(85, 108);
    };
}

function pickin(low, hig) {
    return Math.round(Math.random() * (hig - low)) + low;
}

function release(synev) {
    return function() {
        verbose && console.log("_ release: ", synev.key);
        document.body.dispatchEvent(new KeyboardEvent("keyup", synev));
        return pickin(95, 118);
    };
}

function idle(t) {
    return function(){
        verbose && console.log("_ idle: ", t);
        return 1000*t + pickin(11, 77);
    };
}

function invClick(c) {
    return function() {
        verbose && console.log("__ trigger click on 4th inv item");
        relay.firstChild.click();
    }
}

var LSHIFT = {code:"ShiftLeft",key:"Shift",keyCode:16,which:16,bubbles:true,location:1,shiftKey:true};
function shiftPress(e) {
    e.shiftKey = true;
    return function(){
        return new Promise(function(resolve, reject){
            LSHIFT.shiftKey = true;
            var d1 = press(LSHIFT)();
            setTimeout(function(){
                var d2 = press(e)();
                setTimeout(function(){
                    var d3 = release(e)();
                    setTimeout(function(){
                        LSHIFT.shiftKey = false;
                        release(LSHIFT)();
                        resolve();
                    }, d3);
                }, d2);
            }, 900);
        });
    };
}

function positionEventTool() {
    var cAddr = 0;
    var ctx = 0;

    var el = document.getElementById("location_toolbar_coords");
    var cfg = { attributes: false, childList: true, subtree: false };
    var obs = new MutationObserver(function (ms, _) {
        for (var m of ms) {
            var n = m.addedNodes[0] || {};
            cAddr = toAddr(n.data);
            break;
        }
        if (!ctx)
            return;
        verbose && console.log("moved", ctx.to, cAddr);
        var t = ctx.t;
        var g = ctx.g;
        if (cAddr[t] != ctx.to[t]) {
            ctx.reject("off track");
            return ctx = 0;
        }
        if (Math.abs(cAddr[g] - ctx.to[g]) <= 2) {
            ctx.resolve();
            return ctx = 0;
        }
    });
    var itrack = function(from, to) {
        var t, g;
        if (from[0] == to[0]) {
            t = 0; g = 1;
        } else if (from[1] == to[1]) {
            t = 1; g = 0;
        } else return new Promise.reject("untrackable line");
        return new Promise(function(sol, jec){
            ctx = {to: to, t: t, g: g, resolve: sol, reject: jec};
        });
    }
    return {
        listen: function() { obs.observe(el, cfg) },
        ignore: function() { obs.disconnect(); },
        track: itrack,
        now: function() { return cAddr; }
    };
}

function toAddr(txt) {
    return (txt || "")
        .replace("(","")
        .replace(")", "")
        .split(",")
        .map(function(e){return 1*e.trim()});
}

function proll() {
    if (!ctx.pinit) {
        var tool = positionEventTool();
        ctx.teardown = function(err){
            err && verbose && console.log("__[xx] crashed", err);
            verbose && console.log("__ teardown!");
            tool.ignore();
            ctx = {};
        }
        tool.listen();
        ctx.ptool = tool;
        ctx.pinit = 1;
    }
    var cmds = ctx.cmds;
    var len = cmds.length;
    var idx = ctx.idx;
    (idx <= 1) && verbose && console.log("__ start round", ctx.round);
    if (idx >= len)
        return (0 == (ctx.round -= 1))
            ? ctx.teardown()
            : (ctx.idx = 1) && proll();
    var next;
    while (idx < len) {
        next = detectAct(cmds, idx);
        if (next) break;
        idx++;
    }
    if (!next)
        return (ctx.idx = len+1) && proll();
    ctx.idx = next.idx;
    return next.act.then(proll, ctx.teardown);
}

function detectAct(cmd, idx) {
    var c = cmd.charAt(idx);
    switch (c) {
        case '(': return pmove(cmd, idx);
        case 'u':
        case 'd':
        case 'l':
        case 'r': return ppress(c, idx);
    }
    return;
}

function pmove(cmd, idx) {
    var from, to, len;
    from = to = idx;
    len = cmd.length;
    while (to < len) {
        var c = cmd.charAt(to);
        if (c == ')') break;
        to++;
    }
    to++;
    if (to > len) return;
    var addr = toAddr(cmd.substring(from,to));
    if (!addr.length) return;
    if (!ctx.prev) return (ctx.prev = addr) && 0;
    var prev = ctx.prev;
    var minfo = toMovementKey(prev, addr);
    if (!minfo)
        return { act: Promise.reject("reject move from " + JSON.stringify(prev) + " to " + JSON.stringify(addr)) };
    var setPrevFn = function(){ ctx.prev = addr; };
    if (minfo.gap < 2)
        return { act: pclick(minfo.key, addr).then(setPrevFn), idx: to };
    verbose && console.log("__ move gap", minfo.gap);
    press(minfo.key)();
    var pro = ctx.ptool.track(prev, addr)
        .then(
            function(){
                release(minfo.key)();
                return pclick(minfo.key, addr).then(setPrevFn);
            }, function(err){
                release(minfo.key)();
                return Promise.reject(err);
            });
    return { act: pro, idx: to };
}

function ppress() {
    console.warn("#fme | placeholder ppress");
}

function toMovementKey(from, to) {
    var k, gap;
    if (from[0] == to[0]) {
        if (from[1] < to[1]) return { key: keys.up(), gap: to[1]-from[1] };
        return { key: keys.down(), gap: from[1]-to[1] };
    }
    if (from[1] == to[1]) {
        if (from[0] < to[0]) return { key: keys.right(), gap: to[0]-from[0] };
        return { key: keys.left(), gap: from[0]-to[0] };
    }
    return;
}

function pclick(key, addr) {
    return new Promise(function(resolve, reject){
        var d, t;
        var loop = function(){
            if (!t) {
                if (!ctx.ptool) return reject("!position tool is nok");
                var c = ctx.ptool.now();
                verbose && console.log("__ pclick: position check");
                if (c[0] == addr[0] && c[1] == addr[1]) return resolve();
            }
            d = t ? release(key)() : press(key)();
            if (t) d += 75;
            t = !t;
            setTimeout(loop, d);
        }
        loop();
    });
}

function onKeyFn(e) {
    if (e.key == "Control") {
        verbose && console.log("__ cancelling ...");
        clearTimeout(cid);
        ctx.cmds = 0;
        ctx.pinit && ctx.teardown();
    }
    if (e.shiftKey && (e.key == "\\" || e.key == "|")) {
        verbose && console.log("__ ready");
        ctx.w = 1;
    }
    if (ctx.w) {
        switch(e.key) {
            case "1":
            case "2":
            case "3":
            case "4":
                ctx.w = 0;
                runControl("ibks", e.key);
                break;
            default:
                break;
        }
    }
}

document.addEventListener("keydown", onKeyFn);
