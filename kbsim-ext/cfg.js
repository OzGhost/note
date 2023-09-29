function save(e) {
    e.preventDefault();
    var val = document.querySelector("textarea").value;
    browser.storage.sync.set({ cmds: val })
        .then(function(){
            document.querySelector("button").innerText = "Saved!";
        });
}
function load() {
    browser.storage.sync.get("cmds").then(function(payload){
        document.querySelector("textarea").value = payload.cmds || "";
    });
}
document.addEventListener("DOMContentLoaded", load);
document.querySelector("form").addEventListener("submit", save);

