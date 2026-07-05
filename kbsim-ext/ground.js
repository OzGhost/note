var ctx = {};
var verbose = 0;
var cid = 0;
var edoc = 0;
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
    kE: function(){return {code:"KeyE",key:"e",keyCode:69,which:69,bubbles:true}},
    void:  {}
};

function runControl(payload, num) {
    if (ctx.cmds)
        return console.warn("__[xx] busy");
    if (payload == "ibks") {
        ctx.num = +num;
        return browser.storage.local.get("cmds").then(runControl);
    }
    var cmds = payload.cmds || [];
    cmds = cmds[ctx.num - 1];
    verbose && console.log(" __ execute: ", ctx.num);
    if (!cmds) {
        console.warn(" .. load default commands!");
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
    verbose && console.log(">> load rounds: ", buf);
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
        return pickin(65, 108);
    };
}

function pickin(low, hig) {
    return Math.round(Math.random() * (hig - low)) + low;
}

function release(synev) {
    return function() {
        verbose && console.log("_ release: ", synev.key);
        document.body.dispatchEvent(new KeyboardEvent("keyup", synev));
        return pickin(85, 118);
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
    var cAddr = [];
    var ctx = 0;

    var el = document.getElementById("location_toolbar_coords");
    var cfg = { attributes: false, childList: true, subtree: false };
    var obs = new MutationObserver(function (ms, _) {
        for (var m of ms) {
            var n = m.addedNodes[0] || {};
            cAddr = toAddr(n.data);
            break;
        }
        if (!ctx) return;
        clearTimeout(ctx.ti);
        if (ctx.mode == "once") {
            verbose && console.log("__ once!");
            ctx.sol();
            return ctx = 0;
        }
        verbose && console.log("__ moved", cAddr);
        clearTimeout(ctx.idleTi);
        var t = ctx.t;
        var g = ctx.g;
        var jec = ctx.jec;
        var fn;
        if (cAddr[t] != ctx.to[t])
            fn = function(){ jec("Off track!") };
        else if (Math.abs(cAddr[g] - ctx.to[g]) <= 2)
            fn = ctx.sol;
        if (fn) {
            var d = release(ctx.key)();
            ctx = 0;
            return setTimeout(fn, d);
        }
        ctx.ti = setTimeout(function(){
            verbose && console.log("____ retrigger!");
            var d = release(ctx.key)();
            setTimeout(press(ctx.key), d);
        }, 500);
        ctx.idleTi = setTimeout(unfreeze, 3000);
    });
    var itrack = function(from, to, key) {
        var t, g;
        if (from[0] == to[0]) {
            t = 0; g = 1;
        } else if (from[1] == to[1]) {
            t = 1; g = 0;
        } else return Promise.reject("untrackable line");
        return new Promise(function(sol, jec){
            verbose && console.log("__ init and track", from, to);
            ctx = {mode: "track", key: key, to: to, t: t, g: g, sol: sol, jec: jec};
            press(key)();
            ctx.idleTi = setTimeout(unfreeze, 3000);
        });
    }
    var unfreeze = function() {
        if (!ctx) return;
        clearTimeout(ctx.ti);
        ctx.key && release(ctx.key)();
        ctx.jec && ctx.jec("tracker is not response!");
        ctx = 0;
    };
    var ionce = function() {
        return new Promise(function(sol, jec){
            ctx = {mode: "once", sol: sol, jec: jec};
            ctx.ti = setTimeout(function(){ jec("once timeouted!"); ctx = 0; }, 3000);
        });
    }
    var idc = function(){
        obs.disconnect();
        if (!ctx) return;
        clearTimeout(ctx.ti);
        clearTimeout(ctx.idleTi);
        if (ctx.mode == "track") release(ctx.key)();
        if (ctx.jec) ctx.jec(":- position tool go off!");
        ctx = 0;
    }
    return {
        listen: function() { obs.observe(el, cfg) },
        ignore: idc,
        track: itrack,
        now: function() { return cAddr; },
        once: ionce,
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
        var ptl = positionEventTool();
        var ctl = combatEventTool();
        var itl = invEventTool();
        var htl = hpEventTool();
        var atl = slotEventTool();
        ctx.teardown = function(err){
            if (err) console.warn("__[xx] crashed, ", err);
            else verbose && console.log("__ teardown!");
            ptl.ignore(); ctl.dc(); itl.dc(); htl.dc(); atl.dc();
            ctx = {};
        }
        ptl.listen(); ctl.open(); itl.open(); htl.open();
        ctx.ptool = ptl;
        ctx.ctool = ctl;
        ctx.itool = itl;
        ctx.htool = htl;
        ctx.atool = atl;
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
        case 'r': return ppress(cmd, idx);
        case 'k': return kkpress(cmd, idx);
        case '+': return mapSwitch(cmd, idx);
        case 'w': return pwait(cmd, idx);
        case '%': return combatClock(cmd, idx);
        case '~': return qLoad(cmd, idx);
        case '>': return invWatch(cmd, idx, 1);
        case '<': return invWatch(cmd, idx, -1);
        case '@': return slotWatch(cmd, idx);
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
    if (minfo.gap <= 2)
        return { act: pclick(minfo.key, addr).then(setPrevFn), idx: to };
    verbose && console.log("__ move gap", minfo.gap);
    var pro = ctx.ptool.track(prev, addr, minfo.key)
        .then(function(){ return pclick(minfo.key, addr).then(setPrevFn); });
    return { act: pro, idx: to };
}

function ppress(cmd, idx) {
    var key;
    switch (cmd.charAt(idx)) {
        case 'u': key = keys.up(); break;
        case 'd': key = keys.down(); break;
        case 'l': key = keys.left(); break;
        case 'r': key = keys.right(); break;
        default: return;
    }
    return { act: k2act(key), idx: idx+1 };
}

function k2act(key) {
    return new Promise(function(sol, jec){
        var d = press(key)();
        setTimeout(function(){
            d = release(key)();
            setTimeout(sol, d);
        }, d);
    });
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
        var d, t, p;
        var tries = 0;
        var posCheck = function(){
            if (!ctx.ptool) return reject("no ptool");
            var c = ctx.ptool.now();
            verbose && console.log("__ position check", addr, c);
            if (c[0] == addr[0] && c[1] == addr[1]) return resolve();
            if (tries++ > 9) return reject("____ retry exhausted!");
            t = 0;
            loop();
        }
        var loop = function(){
            if (t) {
                release(key)();
                return p.then(posCheck, reject);
            }
            if (!ctx.ptool) return reject("no ptool");
            p = ctx.ptool.once();
            t = 1;
            var d = press(key)();
            setTimeout(loop, 0.5*d);
        }
        posCheck();
    });
}

function kkpress(cmd, idx){
    var i = idx+1;
    if (i >= cmd.length) return;
    var name = 'k' + cmd.charAt(i).toUpperCase();
    var keyfn = keys[name];
    if (!keyfn) return;
    return { act: k2act(keyfn()), idx: i+1 };
}

function mapSwitch(cmd, idx) {
    var sub;
    var pro = new Promise(function(sol, jec){
        verbose && console.log("__ install map switch hook");
        ctx.ptool.once().then(function(){
            if (!sub) return;
            ctx.prev = ctx.ptool.now();
            sol();
        }, jec);
        sub = ppress(cmd, idx+1);
    });
    if (!sub) return;
    return { act: pro, idx: sub.idx };
}

function pwait(cmd, idx) {
    var i = idx+1;
    if (i >= cmd.lengthh) return;
    var c = cmd.charAt(i);
    if ('0' >= c && c > '9') return;
    verbose && console.log("_ busy wait", c);
    var p = new Promise(function(sol,jec){ setTimeout(sol, 1000*c) });
    return { act: p, idx: i+1 };
}

function combatEventTool() {
    var ctx = 0;
    var el = document.getElementById("enemy_healthbar");
    var cfg = { attributes: true, childList: false, subtree: false };
    var obs = new MutationObserver(function (ms, _) {
        if (!ctx) return;
        for (var m of ms) {
            if (m.target.className.split(' ').includes("hidden"))
                ctx.ti = setTimeout(function(){
                    verbose && console.log("__ fight over");
                    if (!ctx) return;
                    clearTimeout(ctx.ii);
                    ctx.sol();
                    ctx = 0;
                }, 750);
            else clearTimeout(ctx.ti);
            break;
        }
    });
    var iCwait = function() {
        return new Promise(function(sol, jec){
            var t = setTimeout(function(){ jec("combat timeout!"); }, 45000);
            ctx = { ii: t, sol: sol, jec: jec};
        });
    }
    var idc = function() {
        obs.disconnect();
        if (!ctx) return;
        clearTimeout(ctx.ii);
        clearTimeout(ctx.ti);
        if (ctx.jec) ctx.jec(":- combat tool go off!");
        ctx = 0;
    }
    return {
        open: function() { obs.observe(el, cfg) },
        dc: idc,
        cwait: iCwait
    };
}

function combatClock(cmd, idx) {
    var sub;
    var pro = new Promise(function(sol, jec){
        verbose && console.log("____ install combat hook");
        ctx.ctool.cwait().then(function(){
            if (!sub) return;
            var now = ctx.ptool.now();
            if (now.length) ctx.prev = now;
            sol();
        }, jec);
        sub = ppress(cmd, idx+1);
        if (!sub) sub = spress(cmd, idx+1);
        if (sub) sub.act.catch(jec);
    });
    if (!sub) {
        verbose && console.log("__ __ no post hook, ignore combat");
        return;
    }
    pro = pro.then(function(){
        if (ctx.htool.now() < 10) return Promise.reject("low hp");
        //if (ctx.itool.now() == 0) return Promise.reject("inv full");
    });
    return { act: pro, idx: sub.idx };
}

function qLoad(cmd, idx) {
    if (!edoc) return console.warn("_ the e-doc not ready!");
    var ftr = edoc.childNodes[0];
    if (!ftr) {
        ftr = document.createElement("button");
        edoc.appendChild(ftr);
    }
    var ins = [["of wat", 7],["blueberry", 28]];
    verbose && console.log("__ trigger keybinds " + JSON.stringify(ins));
    var acts = "var kfn=Keybindings.execute_commands;";
    acts += "kfn(47,undefined,!0);";
    for (var i = 0; i < ins.length; i++) {
        acts += "kfn(54,'" +ins[i][0]+ "',!0);";
        acts += "kfn(64,'" +ins[i][1]+ "',!0);";
        acts += "kfn(54,'',!0);";
    }
    ftr.setAttribute("onclick", acts);
    var pro = new Promise(function(sol, jec){
        setTimeout(function(){ ftr.click(); setTimeout(sol, 500); }, 0);
    });
    return { act: pro, idx: idx+1 };
}

function invEventTool() {
    var ctx = 0;
    var v = -1;
    var el = document.getElementById("inventory_counts");
    var cfg = { attributes: false, childList: true, subtree: false };
    var obs = new MutationObserver(function (ms, _) {
        for (var m of ms) {
            v = 1*(m.addedNodes[0].data.split(' ')[0]);
            break;
        }
        if (!ctx) return;
        clearTimeout(ctx.tid);
        if (!met(ctx.d, ctx.v)) {
            ctx.tid = setTimeout(function(){ ctx.jec("inv frozen"); }, 90000);
            return;
        }
        verbose && console.log("___ inv conds hit", v, ctx.v, ctx.d);
        var sol = ctx.sol;
        setTimeout(sol, 200);
        ctx = 0;
        v = -1;
    });
    function met(delta, val) {
        return (delta > 0) ? (v > val) : (v < val);
    }
    var iuntil = function(val, delta){
        if (v >= 0 && met(delta, val)) return Promise.resolve();
        verbose && console.log("__ load inv watch", val, delta);
        return new Promise(function(sol, jec){
            ctx = {sol: sol, jec: jec, v: val, d: delta};
            ctx.tid = setTimeout(function(){ ctx.jec("inv frozen"); }, 90000);
            setTimeout(function(){ jec("inv timeout"); }, 360000);
        });
    }
    var idc = function() {
        obs.disconnect();
        if (!ctx) return;
        clearTimeout(ctx.tid);
        ctx.jec(":- inv tool go off");
    }
    return {
        open: function() { obs.observe(el, cfg) },
        dc: idc,
        until: iuntil,
        now: function() { return v; }
    };
}

function invWatch(cmd, idx, delta) {
    if (!ctx.itool) return;
    var val = readDDigit(cmd, idx);
    if (val < 0) {
        verbose && console.log("___ inv: 2 digits suffix required");
        return;
    }
    return { act: ctx.itool.until(val, delta), idx: idx+3 };
}

function readDDigit(cmd, idx) {
    var i = idx + 2;
    if (i >= cmd.length) return -1;
    var c = cmd.charAt(i);
    if ('0' > c && c > '9') return -1;
    var tail = 1 * c;
    c = cmd.charAt(i-1);
    if ('0' > c && c > '9') return -1;
    return 10*c + tail;
}

function spress(cmd, idx) {
    var key;
    switch (cmd.charAt(idx)) {
        case 'U': key = keys.up(); break;
        case 'D': key = keys.down(); break;
        case 'L': key = keys.left(); break;
        case 'R': key = keys.right(); break;
        default: return;
    }
    var act = new Promise(function(sol, jec){
        var before = ctx.ptool.now();
        if (!before || !before.length) return jec("current pos is unknown!");
        key.shiftKey = true;
        LSHIFT.shiftKey = true;
        press(LSHIFT)();
        setTimeout(function(){
            var d = press(key)();
            setTimeout(function(){
                LSHIFT.shiftKey = false;
                release(key)();
                release(LSHIFT)();
                setTimeout(function(){
                    var after = ctx.ptool.now();
                    if (before[0] == after[0] && before[1] == after[1]) sol();
                    else jec("shooting target unavailable!");
                }, pickin(200, 300));
            }, d);
        }, pickin(900, 1500));
    });
    return { act: act, idx: idx+1 };
}

function hpEventTool() {
    var v = -1;
    var el = document.getElementById("player_health_name");
    var cfg = { attributes: false, childList: true, subtree: false };
    var obs = new MutationObserver(function (ms, _) {
        for (var m of ms) {
            var txt = m.addedNodes[0].data;
            var l = txt.indexOf('(') + 1;
            var h = txt.indexOf('/');
            v = 1*(txt.substring(l, h));
            verbose && console.log("__ change in hp", v);
            break;
        }
    });
    return {
        open: function() { obs.observe(el, cfg) },
        dc: function() { obs.disconnect(); },
        now: function() { return v; }
    };
}

function slotEventTool() {
    var obs, ctx, tid;
    var islot = function(idx) {
        if (obs) {
            verbose && console.log("____ ! slot event register repeated");
        } else {
            verbose && console.log("__ watch slot #", idx);
            var el = document.getElementById("inv_" + idx);
            var cfg = { attributes: true, childList: false, subtree: false };
            obs = new MutationObserver(function (ms, _) {
                clearTimeout(tid);
                if (!ctx) return;
                var sol = ctx.sol;
                ctx = 0;
                setTimeout(sol, 200);
            });
            obs.observe(el, cfg);
        }
        return new Promise(function(sol, jec){
            ctx = {sol: sol, jec: jec};
            tid = setTimeout(function(){ jec("slot timeout!");}, 180000);
        });
    }
    var idc = function() {
        if (obs) obs.disconnect();
        clearTimeout(tid);
        if (ctx) ctx.jec(":- slot tool go off!");
    }
    return {
        onSlot: islot,
        dc: idc
    };
}

function slotWatch(cmd, idx) {
    if (!ctx.atool) return;
    var val = readDDigit(cmd, idx);
    if (val < 0) {
        verbose && console.log("___ slot: 2 digits suffix required");
        return;
    }
    return { act: ctx.atool.onSlot(val), idx: idx+3 };
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
(function(){
    edoc = document.getElementById("mahdoc");
    if (!edoc) {
        edoc = document.createElement("div");
        edoc.id = "mahdoc";
        edoc.style.position = "absolute";
        edoc.style.border = "1px dashed grey";
        edoc.style.padding = "8px 12px";
        edoc.style.top = "-50px";
        edoc.style.left = "8px";
        document.body.appendChild(edoc);
    }
})();

