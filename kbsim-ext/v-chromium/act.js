document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get({ inUse: "", lines: [] }, function(payload){
        var lines = payload.lines;
        if ( ! Array.isArray(payload.lines))
            lines = [];
        for (var i = 0; i < lines.length; i++) {
            var t = document.createElement("p");
            var checked = lines[i].k == payload.inUse ? 'checked' : '';
            t.innerHTML = ''
                + '<p><input type="radio" name="scenario" id="oid-'+i+'" '+checked+'/>'
                + '<label for="oid-'+i+'">'+lines[i].k+'</label></p>'
            ;
            document.body.appendChild(t);
            (function(){
                var p = lines[i];
                t.addEventListener('click', function(e){
                    e.stopPropagation();
                    chrome.storage.sync
                        .set({ inUse: p.k, cmds: p.v }, function(){ window.close(); });
                });
            })();
        }
    });
});
