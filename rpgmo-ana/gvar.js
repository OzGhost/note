function makePrint(id, head) {
    var dz = 0;
    var func = function(msg) {
        if (!dz) {
            var fr = document.getElementById(id);
            var h = document.createElement('h4');
            h.innerHTML = head;
            fr.appendChild(h);
            dz = document.createElement('pre');
            fr.appendChild(dz);
            fr.appendChild(document.createElement('hr'));
        }
        dz.innerText += msg + '\n';
    }
    func.reset = function(){
        dz.innerText = '';
    }
    return func;
}
function createObject(arg, _){
    return arg;
}
function thousandSeperate(arg) {
    return ''+arg;
}
var ITEM_CATEGORY = {}
var IMAGE_SHEET = {}
var HIT_ANIMATION = {}
var BASE_TYPE = {}
var OBJECT_TYPE = {}
var ACTIVITIES = {}
var cow_image = ""
