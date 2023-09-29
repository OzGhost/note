console.log(" ... grounded!");
function pickin(low, hig) {
    return Math.round(Math.random() * (hig - low)) + low;
}
function drive(d) {
    var synev = 0;
    switch (d) {
        case "u": synev = {code:"ArrowUp",key:"ArrowUp",keyCode:38,which:38,bubbles:true}; break;
        case "d": synev = {code:"ArrowDown",key:"ArrowDown",keyCode:40,which:40,bubbles:true}; break;
        case "l": synev = {code:"ArrowLeft",key:"ArrowLeft",keyCode:37,which:37,bubbles:true}; break;
        case "r": synev = {code:"ArrowRight",key:"ArrowRight",keyCode:39,which:39,bubbles:true}; break;
        default: synev = {code:"ArrowUp",key:"ArrowUp",keyCode:38,which:38,bubbles:true}; break;
    }
    return new Promise(function(resolve, reject){
        document.body.dispatchEvent(new KeyboardEvent("keydown", synev));
        setTimeout(function(){
            document.body.dispatchEvent(new KeyboardEvent("keyup", synev));
            setTimeout(resolve, pickin(50, 80));
        }, pickin(60, 100));
    });
}
var inused = false;
var cancelled = false;
function unwire(){ inused = false; }
function cancelfn(e) { if (e.key == "Control") cancelled = true; }
document.addEventListener("keydown", cancelfn);

function runControl(payload) {
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
            (function(){
                var d = cmds.charAt(i);
                if (d == " " || d == "\n") return;
                anc = anc.then(function(){
                    return cancelled
                        ? Promise.reject(new Error("cbks"))
                        : drive(d);
                });
            })();
        }
        anc.then(unwire, unwire);
    }, 1000);
}
browser.runtime.onMessage.addListener(function(){
    if (inused) return;
    browser.storage.sync.get("cmds").then(runControl);
});

