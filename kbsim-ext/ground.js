console.log(" ... grounded!");
function pickin(low, hig) {
    return Math.round(Math.random() * (hig - low)) + low;
}
function drive(d) {
    var code = 0;
    switch (d) {
        case "u": code = 38; break;
        case "d": code = 40; break;
        case "l": code = 37; break;
        case "r": code = 39; break;
        default: code= 38; break;
    }
    return new Promise(function(resolve, reject){
        document.body.dispatchEvent(new KeyboardEvent("keydown", {keyCode: code, bubbles: true}));
        setTimeout(function(){
            document.body.dispatchEvent(new KeyboardEvent("keyup", {keyCode: code, bubbles: true}));
            setTimeout(resolve, pickin(50, 80));
        }, pickin(60, 100));
    });
}
browser.runtime.onMessage.addListener((msg) => {
    //console.log("[ground] received: ", msg);
    console.log("about to run in 2 sec ...");
    /*
     ulululululululululululul
     rdrdrdrdrdrdrdrdrdrdrdrdrd
     rrru
     ulululululululululululul
     rdrdrdrdrdrdrdrdrdrdrdrdrd
     rrru
     ulululululululululululul
     rdrdrdrdrdrdrdrdrdrdrdrdrd
     rrru
     ulululululululululululul
     rdrdrdrdrdrdrdrdrdrdrdrdrd
     */
    var cmds = "uuullldddrrr";
    cmds = "ululululululululululululrdrdrdrdrdrdrdrdrdrdrdrdrdrrruululululululululululululrdrdrdrdrdrdrdrdrdrdrdrdrdrrruululululululululululululrdrdrdrdrdrdrdrdrdrdrdrdrdrrruululululululululululululrdrdrdrdrdrdrdrdrdrdrdrdrd";
    setTimeout(function(){
        var anc = Promise.resolve();
        for (var i = 0; i < cmds.length; i++) {
            (function(){
                var d = cmds.charAt(i);
                anc = anc.then(function(){ return drive(d); });
            })();
        }
    }, 2000);
});
