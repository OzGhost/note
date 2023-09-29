
var tidPm = browser.tabs.query({ currentWindow: true, active: true })
    .then(function(tabs){
        var t = tabs[0];
        console.log("url: ", t.url);
        if (t.url != "https://data.mo.ee/") {
            return Promise.reject("url not matched");
        }
        return Promise.resolve(t.id);
    })
    .catch(function(e){ console.log("tab id not available", e); });
var root = document.getElementById("droot");
var n = root.childNodes.length
function ignite(){
    tidPm.then(function(tid){
        console.log("msg sending ...");
        browser.tabs.sendMessage(tid, { code: 1293, type: "mahMsg" });
        window.close();
    });
}
for (var i = 0; i < n; i++) {
    var tag = root.childNodes[i];
    if (tag.tagName == "BUTTON") {
        tag.addEventListener("click", ignite);
    }
}
document.addEventListener("DOMContentLoaded", ignite);
