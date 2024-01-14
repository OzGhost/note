var pincer = 0;
function save(e) {
    e.preventDefault();
    var inp = document.querySelectorAll("input");
    var tare = document.querySelectorAll("textarea");
    var i = 0;
    var lines = [];
    for (; i < inp.length; i++) {
        lines.push({k: inp[i].value, v: tare[i].value});
    }
    chrome.storage.sync.set({ cmds: "", inUse: "", lines: lines }, function(){
        var btn = document.querySelectorAll("button");
        btn[btn.length-1].innerText = "Saved!";
    });
}
function newline(k, v){
    var t = document.createElement("tr");
    t.innerHTML = '<td><input type="text" value="'+k+'" /><br/><button type="button">( - )</button></td>'
                + '<td><textarea rows="9" cols="60">'+v+'</textarea></td>';
    t.querySelector("button").addEventListener('click', function() { t.remove(); });
    pincer.parentNode.insertBefore(t, pincer);
}
function load() {
    document.querySelector("form").addEventListener("submit", save);
    pincer = document.getElementById("pincer");
    pincer.querySelector("button").addEventListener("click", function(){ newline('',''); });

    chrome.storage.sync.get({ lines: [] }, function(payload){
        var lines = payload.lines;
        if ( ! Array.isArray(payload.lines))
            lines = [];
        for (var i = 0; i < lines.length; i++) {
            newline(lines[i].k, lines[i].v);
            var x = lines[i].k + " >> " + lines[i].v;
        }
    });
}

document.addEventListener("DOMContentLoaded", load);
