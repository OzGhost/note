var ctx = {};
var verbose = false;
var cid = 0;
verbose && console.log("__[o0] i'm in");

function runControl(payload) {
    if (ctx.cmds)
        return verbose && console.warn("__[xx] busy");
    if (payload == "ibks") {
        browser.storage.sync.get("cmds").then(runControl);
        return;
    }
    var cmds = payload.cmds;
    if (!cmds) {
        verbose && console.warn(" .. load default commands!");
        cmds = ""
                + "    urur    urururur    urururur    urururur    urururur    urururur    ur"
                + "rdrdrdrd    rdrdrdrd    rdrdrdrd    rdrdrdrd    rdrdrdrd    rdrdrdrd    rd"
                + "dldldldl    dldldldl    dldldldl    dld dldl    dldldldl    dldldldl    dl"
                + "lulululu    lulululu    lulululu    lulululu    lulululu    lul"

                + "ul ulrulrulr    ulrulrulrulr    ulrulrulrulr    ulrulrul ulr    ulrulrulr    ulrulrulr    ulu"
                + "ru rudrudrud    rudrudrudrud    rudrudrudrud    rudrudrudrud    rudrudrud    rur"
                + "dr drldr drl    drldrldrldrl    drldrldrldrl    drldrldrldrl    drldrldrl    drd"
                + "ld ldulduldu    lduldulduldu    lduldulduldu    ld ldulduldu    ldl"

                + "ul ulrulrulr    ulrulrulrulr    ulrulrulrulr    ulrulrulrulr    ulu"
                + "ru rudrudrud    rudrudrudrud    rudru rudrud    rud    rur"
                + "dr drldrldrl    drldrldrldrl    drldrldrldrl    drl    drd"
                + "ld ldulduldu    lduldulduldu    lduldu    ldl"

                + "ul ulrul ulr    ulrulrulrulr    ulrulr     ulu"
                + "ru rudrudrud    rudrudrud    rur"
                + "dr drldrldrl    drldrldrl    drd"
                + "ld ldulduldu    ldl"

                + "ul ulrulrul    ulu"
                + "rurur drdrdr"
        ;
    }
    ctx = { cmds: cmds, idx: 0 };
    verbose && console.log("1 sec ...");
    cid = setTimeout(roll, 500);
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
    if (!p)
        return (ctx = {});
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
        return pickin(55, 88);
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
    if (e.shiftKey && (e.key == "\\" || e.key == "|"))
        runControl("ibks");

}
document.addEventListener("keydown", onKeyFn);
