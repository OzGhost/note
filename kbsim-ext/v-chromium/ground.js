console.log("__[o0] i'm in");
var inused = false;
var cancelled = false;
function unwire(){ inused = false; }

function runControl(payload) {
    if (inused)
        return;
    if (payload == "ibks") {
        chrome.storage.sync.get({ cmds: "" }, runControl);
        return;
    }
    var cmds = payload.cmds;
    if (!cmds) {
        console.warn("no cfg found > load default cfg ...");
        cmds = " ul ul ul ul ul ul ul ul ul ul ul ul"
                + " rd rd rd rd rd rd rd rd rd rd rd rd rd"
                + "rrru"
                + " ul ul ul ul ul ul ul ul ul ul ul ul"
                + " rd rd rd rd rd rd rd rd rd rd rd rd rd"
                + "rrru"
                + " ul ul ul ul ul ul ul ul ul ul ul ul"
                + " rd rd rd rd rd rd rd rd rd rd rd rd rd"
                + "rrru"
                + " ul ul ul ul ul ul ul ul ul ul ul ul"
                + " rd rd rd rd rd rd rd rd rd rd rd rd rd"
        ;
    }
    inused = true;
    cancelled = false;
    console.log("1 sec ...");
    setTimeout(function(){
        var anc = Promise.resolve();
        for (var i = 0; i < cmds.length; i++) {
            var d = cmds.charAt(i);
            if (d == " " || d == "\n")
                continue;
            anc = digest(d, cmds, i, anc);
        }
        anc.then(unwire, unwire);
    }, 1000);
}
function digest(c, cmds, i, anc) {
    var synev = undefined;
    var waitSig = false;
    var kbev = undefined;
    switch (c) {
        case "u":
            synev = {code:"ArrowUp",key:"ArrowUp",keyCode:38,which:38,bubbles:true}; break;
        case "d":
            synev = {code:"ArrowDown",key:"ArrowDown",keyCode:40,which:40,bubbles:true}; break;
        case "l":
            synev = {code:"ArrowLeft",key:"ArrowLeft",keyCode:37,which:37,bubbles:true}; break;
        case "r":
            synev = {code:"ArrowRight",key:"ArrowRight",keyCode:39,which:39,bubbles:true}; break;
        case "w":
            waitSig = true; break;
        case "k":
            kbev = true; break;
        default:
            break;
    }
    if (synev)
        return anc.then(function(){
                    return cancelled
                        ? Promise.reject(new Error("cbks"))
                        : press(synev);
                    });
    if (waitSig) {
        var ni = i+1;
        var nc = cmds.charAt(ni);
        var sec = "";
        var l = 0;
        while ("0" <= nc && nc <= "9" && l < 5) {
            sec += nc;
            ni++;
            nc = cmds.charAt(ni);
            l++;
        }
        if (sec)
            return anc.then(function(){
                    return cancelled
                        ? Promise.reject(new Error("cbks"))
                        : rest(1000*sec);
                    });
    }
    if (kbev) {
        switch(cmds.charAt(i+1)) {
            case "x":
                kbev = {code:"KeyX",key:"x",keyCode:88,which:88,bubbles:true}; break;
            case "t":
                kbev = {code:"KeyT",key:"t",keyCode:84,which:84,bubbles:true}; break;
            default:
                return anc;
        }
        return anc.then(function(){
            return cancelled
                ? Promise.reject(new Error("cbks"))
                : press(kbev);
        });
    }
    return anc;
}
function press(synev) {
    return new Promise(function(resolve, reject){
        document.body.dispatchEvent(new KeyboardEvent("keydown", synev));
        setTimeout(function(){
            document.body.dispatchEvent(new KeyboardEvent("keyup", synev));
            setTimeout(resolve, pickin(80, 110));
        }, pickin(80, 110));
    });
}
function pickin(low, hig) {
    return Math.round(Math.random() * (hig - low)) + low;
}
function rest(delay) {
    return new Promise(function(resolve, reject){
        setTimeout(resolve, delay + pickin(1, 99));
    });
}

function onKeyFn(e) {
    if (e.key == "Control")
        cancelled = true;
    if (e.shiftKey && (e.key == "M" || e.key == "m"))
        runControl("ibks");

}
document.addEventListener("keydown", onKeyFn);
