function makePrint(id, head) {
    var dz = 0;
    return function(msg) {
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
