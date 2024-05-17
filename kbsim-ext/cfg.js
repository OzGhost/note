function save(e) {
    e.preventDefault();
    var tags = document.getElementsByTagName("textarea");
    var vals = [];
    for (var i = 0; i < tags.length; i++)
        vals[i] = tags[i].value;
    console.log(vals);
    browser.storage.local.set({ cmds: vals })
        .then(function(){
            document.querySelector("button").innerText = "Saved!";
        });
}
function load() {
    console.log("init cfg");
    browser.storage.local.get("cmds").then(function(payload){
        if (!payload || !payload.cmds)
            return;
        var tags = document.getElementsByTagName("textarea");
        for (var i = 0; i < tags.length; i++)
            tags[i].value = payload.cmds[i] || "";
    });
}
document.addEventListener("DOMContentLoaded", load);
document.querySelector("form").addEventListener("submit", save);

