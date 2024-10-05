var ctx = {};
var verbose = 0;
var cid = 0;
verbose && console.log("__[o0] i'm in");

function runControl(payload, num) {
    if (ctx.cmds)
        return verbose && console.warn("__[xx] busy");
    if (payload == "ibks") {
        ctx.num = +num;
        browser.storage.local.get("cmds").then(runControl);
        return;
    }
    var cmds = payload.cmds || [];
    cmds = cmds[ctx.num - 1];
    verbose && console.log(" __ execute: ", ctx.num);
    if (!cmds) {
        verbose && console.warn(" .. load default commands!");
        cmds = "uu ll dd rr" ;
    }
    ctx = { cmds: cmds, idx: 0, round: readReps(cmds) };
    verbose && console.log("1 sec ...");
    cid = setTimeout(roll, 500);
}

function readReps(cmds) {
    var buf = "";
    for (var i = 0; i < cmds.length; i++) {
        var c = cmds.charAt(i);
        if (c < '0' || c > '9')
            break;
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
    if (p.fn) {
        var delay = p.fn();
        cid = setTimeout(roll, delay);
        if (delay < 200)
            cid = 0;
    }
}

function digest(d, i) {
    var synev = 0;
    var waitSig = 0;
    var kpSig = 0;
    switch (d) {
        case "u":
            synev = {code:"ArrowUp",key:"ArrowUp",keyCode:38,which:38,bubbles:true};
            break;
        case "d":
            synev = {code:"ArrowDown",key:"ArrowDown",keyCode:40,which:40,bubbles:true};
            break;
        case "l":
            synev = {code:"ArrowLeft",key:"ArrowLeft",keyCode:37,which:37,bubbles:true};
            break;
        case "r":
            synev = {code:"ArrowRight",key:"ArrowRight",keyCode:39,which:39,bubbles:true};
            break;
        case "w":
            waitSig = true;
            break;
        case "k":
            kpSig = true;
            break;
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
                kev = {code:"KeyO",key:"o",keyCode:79,which:79,bubbles:true};
                break;
            case "p":
                kev = {code:"KeyP",key:"p",keyCode:80,which:80,bubbles:true};
                break;
            case "n":
                kev = {code:"KeyN",key:"n",keyCode:78,which:78,bubbles:true};
                break;
            case "s":
                kev = {code:"KeyS",key:"s",keyCode:83,which:83,bubbles:true};
                break;
            case "t":
                kev = {code:"KeyT",key:"t",keyCode:84,which:84,bubbles:true};
                break;
            case "b":
                kev = {code:"KeyB",key:"b",keyCode:66,which:66,bubbles:true};
                break;
            default:
                break;
        }
        if (kev)
            return { fn: press(kev), subFn: release(kev), i: i+2 };
    }
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

function onKeyFn(e) {
    if (e.key == "Control") {
        verbose && console.log("__ cancelling ...");
        clearTimeout(cid);
        ctx.cmds = 0;
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
