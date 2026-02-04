(function(){
    function initDz(names) {
        var dz = document.getElementById('coins-kill-dz');
        var eSelect = 0;
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
        return {
            print: function (txt) { plain.innerText = plain.innerText + '\n' + txt; },
            setMobSelectionCallback: function(e){ eSelect = e; }
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
        var names = [];
        for (var i = 0; i < npc_base.length; i++) {
            var mob = npc_base[i];
            if (!mob || mob.type != OBJECT_TYPE.ENEMY) continue;
            /*
            if ((mob.temp.melee_block || 0) > 20) continue;
            if (mob.temp.total_defense > 460) continue;
            if (mob.temp.total_accuracy > 750) continue;
            */
            names.push({id: i, name: mob.name.toLowerCase()});
        }
        return names;
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
                if (loot.mon_book_only) continue;
                var rate = remain * loot.chance;
                remain -= rate;
                var item = item_base[loot.id];
                var fval = item.params.price;
                var sellat = npcMark[loot.id] ? 0.5 : 0.4;
                var aval = fval * rate * sellat;
                avgVal += aval;
                items.push([item.name, tailFloor(rate*100), tailFloor(aval), sellat]);
            }
            items.sort(function(a,b){ return b[1] - a[1];});
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
            if (loot.mon_book_only) continue;
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

    var npcMark = markNpcBuyItems();
    var mnames = extractNames();
    var dz = initDz(mnames);
    dz.setMobSelectionCallback(newCalculator(npcMark));
    var list = [];
    for (var i = 0; i < mnames.length; i++) {
        var mob = mnames[i];
        if (mob.name.startsWith("[rare")
                || mob.name.startsWith("[boss]")
                || mob.name.startsWith("[elite]"))
            continue;
        list.push({val: valPerHp(npcMark, npc_base[mob.id]), name: mob.name});
    }
    list.sort(function(a,b){return b.val - a.val;});
    for (var j = 0; j < 50; j++) {
        var mob = list[j];
        dz.print(tailFloor(mob.val) + " " + mob.name);
    }
})();
