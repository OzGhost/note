
/*
 * up: 38
 * down: 40
 * left: 37
 * right: 39
 */

var kbsim = function(code){
    setTimeout(function(){
        console.log("pressed");
        document.body.dispatchEvent(new KeyboardEvent("keydown", {keyCode: code, bubbles: true}));
        setTimeout(function(){
            document.body.dispatchEvent(new KeyboardEvent("keyup", {keyCode: code, bubbles: true}));
            console.log("released");
        }, 85);
    }, 3000);
};

