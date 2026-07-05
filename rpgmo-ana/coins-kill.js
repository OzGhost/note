(function(){
    var haveBook = 1;
    function initDz(names, eSelect, mEva) {
        var dz = document.getElementById('coins-kill-dz');
        var hline = document.createElement("h4"); dz.appendChild(hline);
        hline.innerText = "Coins per kill calculator";
        var plain = document.createElement('pre'); dz.appendChild(plain);
        var inpz = document.createElement("div"); dz.appendChild(inpz);
        inpz.className = "anchor-box";
        var nameinp = document.createElement("input"); inpz.appendChild(nameinp);
        var selectz = document.createElement("div"); inpz.appendChild(selectz);
        selectz.className = "fbox";
        nameinp.addEventListener("focus", function(){ selectz.setAttribute("vis", "yes"); });
        nameinp.addEventListener("input", debounce(nameChange));
        var timeId = 0;
        var tab = document.createElement("table"); dz.appendChild(tab);
        var idsinp = document.createElement("input"); dz.appendChild(idsinp);
        idsinp.addEventListener("input", readIds);
        function debounce(action) {
            return function() {
                clearTimeout(timeId);
                timeId = setTimeout(action, 300);
            }
        }
        function nameChange() {
            var wanted = nameinp.value;
            if (wanted.length < 3) return;
            selectz.innerText = "";
            for (var i = 0; i < names.length; i++) {
                var mob = names[i];
                if (!mob.name.includes(wanted)) continue;
                var btn = document.createElement("span"); selectz.appendChild(btn);
                btn.innerText = mob.name;
                btn.mid = mob.id;
                btn.addEventListener("click", function(e){
                    selectz.removeAttribute("vis");
                    if (!eSelect) return;
                    var id = e.target.mid;
                    var rows = eSelect(id);
                    tab.innerText = "";
                    for (var i = 0; i < rows.length; i++)
                        tab.appendChild(rows[i]);
                });
            }
        }
        var iprint = function (txt) { plain.innerText = plain.innerText + '\n' + txt; }
        var iclear = function () { plain.innerText = ''; }
        function readIds() {
            var ids, err;
            try {
                ids = JSON.parse(idsinp.value);
            } catch {
                err = 1;
            }
            if (err) return;
            var lines = mEva(ids);
            iclear();
            for (var i = 0; i < lines.length; i++) {
                iprint(lines[i].val + " " + lines[i].name);
            }
        }
        return {
            print: iprint,
            clear: iclear
        };
    }
    function markNpcBuyItems() {
        var marks = {};
        var len = npc_base.length;
        for (var i = 0; i < len; i++) {
            var npc = npc_base[i];
            if (!npc || npc.type != OBJECT_TYPE.SHOP) continue;
            var tmp = npc.temp || {};
            var content = tmp.content || [];
            for (var j = 0; j < content.length; j++) {
                var item = content[j];
                marks[item.id] = 1;
            }
        }
        return marks;
    }
    function extractNames() {
        var out = { all: [], selected: [] };
        for (var i = 0; i < npc_base.length; i++) {
            var mob = npc_base[i];
            if (!mob || mob.type != OBJECT_TYPE.ENEMY) continue;
            var v = {id: i, name: mob.name.toLowerCase()};
            out.all.push(v);
            //fme
            //if ((mob.temp.melee_block || 0) > 5) continue;
            if (mob.temp.total_defense > 255) continue;
            if (mob.temp.total_accuracy >= 333) continue;
            if (mob.temp.health < 60) continue;
            out.selected.push(v);
        }
        return out;
    }
    function newCalculator(npcMark) {
        return function(id){
            var mob = npc_base[id];
            var loots = mob.params.drops;
            var remain = 1;
            var items = [];
            var avgVal = 0;
            for (var i = 0; i < loots.length; i++) {
                var loot = loots[i];
                if (loot.mon_book_only && !haveBook) continue;
                var rate = remain * loot.chance;
                remain -= rate;
                var item = item_base[loot.id];
                var fval = item.params.price;
                var sellat = npcMark[loot.id] ? 0.5 : 0.4;
                var aval = fval * rate * sellat;
                avgVal += aval;
                items.push([item.name, tailFloor(rate*100), tailFloor(aval), sellat]);
            }
            items.sort(function(a,b){ return b[2] - a[2];});
            var rows = [];
            var mblock = mob.temp.melee_block || 0;
            var enc = 1 - (mblock/100);
            var hp = mob.temp.health / enc;
            rows.push(toRow(["mob: "+mob.name,"avg: "+tailFloor(avgVal),"c/hp: "+tailFloor(avgVal/hp),""]));
            rows.push(toRow(["name", "rate", "value", "sellAt"]));
            for (var i = 0; i < items.length; i++)
                rows.push(toRow(items[i]));
            return rows;
        }
    }
    function toRow(cells) {
        var row = document.createElement("tr");
        for (var i = 0; i < cells.length; i++) {
            var cell = document.createElement("td"); row.appendChild(cell);
            cell.innerText = "" + cells[i];
        }
        return row;
    }
    function tailFloor(v) {
        return Math.floor(v*10000)/10000;
    }
    function valPerHp(npcMark, mob) {
        var loots = mob.params.drops;
        var remain = 1;
        var avgVal = 0;
        for (var i = 0; i < loots.length; i++) {
            var loot = loots[i];
            if (loot.mon_book_only && !haveBook) continue;
            var rate = remain * loot.chance;
            remain -= rate;
            var item = item_base[loot.id];
            var fval = item.params.price;
            var sellat = npcMark[loot.id] ? 0.5 : 0.4;
            var aval = fval * rate * sellat;
            avgVal += aval;
        }
        var mblock = mob.temp.melee_block || 0;
        var enc = 1 - (mblock/100);
        var hp = mob.temp.health / enc;
        return tailFloor(avgVal / hp);
    }

    function multiEvaluate(marks) {
        return function(ids) {
            var l = [];
            for (var i = 0; i < ids.length; i++) {
                var mob = npc_base[ids[i]];
                l.push({val: valPerHp(marks, mob), name: mob.name});
            }
            l.sort(function(a,b){return b.val - a.val;});
            return l;
        }
    }

    var npcMark = markNpcBuyItems();
    var splitList = extractNames();
    var mnames = splitList.all;
    var smobs = splitList.selected;
    var dz = initDz(mnames, newCalculator(npcMark), multiEvaluate(npcMark));
    var list = [];
    for (var i = 0; i < smobs.length; i++) {
        var mob = smobs[i];
        if (mob.name.startsWith("[rare")
                || mob.name.startsWith("[boss]")
                || mob.name.startsWith("[elite]")
                || mob.name.endsWith("mushroom"))
            continue;
        list.push({val: valPerHp(npcMark, npc_base[mob.id]), name: mob.name});
    }
    list.sort(function(a,b){return b.val - a.val;});
    var c = 0;
    for (var j = 0; j < list.length && c < 30; j++) {
        var mob = list[j];
        if (mob.val > 13) continue;
        c++;
        dz.print(tailFloor(mob.val) + " " + mob.name);
    }
})();
