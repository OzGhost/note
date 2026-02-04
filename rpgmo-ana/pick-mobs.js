(function(){
    var print = makePrint('pick-mobs-dz', 'Picked mobs');
    var arr = npc_base;
    var wm = [];
    for (var i = 0; i < arr.length; i++) {
        var npc = arr[i];
        if (!npc || !npc.temp) continue;
        if (npc.name.startsWith('[Rare')) continue;
        if (npc.name.startsWith('[BOSS]')) continue;
        if (npc.name.startsWith('[Boss]')) continue;
        if (npc.name.startsWith('[Elite]')) continue;
        if (/[0-9]$/.test(npc.name)) continue;
        if (npc.fn) continue;
        if (npc.temp.content) continue;
            //print(JSON.stringify(npc, 0, 2));
        var m = {
            name: npc.name,
            a: npc.temp.total_accuracy,
            s: npc.temp.total_strength,
            d: npc.temp.total_defense,
            h: npc.temp.health,
            mb: npc.temp.magic_block || 0,
            sb: npc.temp.melee_block || 0
        };
        if (m.sb > 20) continue;
        if (m.d > 460) continue;
        if (m.a > 750) continue;
        wm.push(m);
    }
    wm.sort(function(a, b){ return b.h - a.h; });
    for (var i = 0; i < wm.length; i++) {
        print(mtostr(wm[i]));
    }
    function mtostr(m) {
        return m.name
            + " [a:" + m.a
            + ",s:" + m.s
            + ",d:" + m.d
            + ",h:" + m.h
            + ",b:" + m.sb
            + "]"
        ;
    }
})();
