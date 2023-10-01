function save(e) {
    e.preventDefault();
    var val = document.querySelector("textarea").value;
    chrome.storage.sync.set({ cmds: val }, function(){
        document.querySelector("button").innerText = "Saved!";
    });
}
function load() {
    chrome.storage.sync.get({ cmds: "" }, function(payload){
        document.querySelector("textarea").value = payload.cmds || "";
    });
}
document.addEventListener("DOMContentLoaded", load);
document.querySelector("form").addEventListener("submit", save);

