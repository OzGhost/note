(function(){
    var qls = skillQs;
    var tid = 0;
    var ctx = {};
    function debounce(fn) {
        clearTimeout(tid);
        tid = setTimeout(fn, 300);
    }
    function dzUp() {
        var ctx = {};
        var root = document.getElementById("skill-quest-dz");
        var tmp = document.createElement("h4"); root.appendChild(tmp);
        tmp.innerText = "Skill quest info";
        var iTxt = document.createElement("input"); root.appendChild(iTxt);
        var tab = document.createElement("table"); root.appendChild(tab);
        tmp = document.createElement("pre"); root.appendChild(tmp);
        tmp.innerText = "*Once ur.point fall out of above range, fall back to\n[ ur.lv/2 < minLv < ur.lv ] or [ minLv < ur.lv < 30+minLv ]";

        function append(vals) {
            var line = document.createElement("tr"); tab.appendChild(line);
            var cell = 0;
            cell = document.createElement("td"); line.appendChild(cell);
            cell.innerText = vals[0];
            cell = document.createElement("td"); line.appendChild(cell);
            cell.innerText = vals[1];
            cell = document.createElement("td"); line.appendChild(cell);
            cell.innerText = vals[2];
        }
        function filterBy(txt) {
            if (!ctx.cb)
                return;
            var ls = ctx.cb(txt);
            tab.innerHTML = "";
            for (var i = 0; i < ls.length; i++)
                append(ls[i]);
        }
        iTxt.addEventListener("input", function(ev){
            var txt = ev.target.value;
            debounce(function(){ filterBy(txt); });
        });
        return {
            onInput: function(callback) { ctx.cb = callback; }
        }
    }
    function loadItemNames() {
        for (var i = 0; i < qls.length; i++) {
            var q = qls[i];
            var item = item_base[q.item_id];
            if (!item)
                continue;
            q.name = item.name;
            q.lowName = item.name.toLowerCase();
        }
    }

    //---
    var dz = dzUp();
    loadItemNames();
    dz.onInput(function(txt){
        var out = [];
        var lowTxt = txt.toLowerCase();
        for (var i = 0; i < qls.length; i++) {
            var q = qls[i];
            if (q.lowName.includes(lowTxt))
                out.push([
                    q.skill,
                    q.name,
                    "[" + q.min_qp + " .. " + (750+q.min_qp) + "]"
                ]);
        }
        return out;
    });
})();
