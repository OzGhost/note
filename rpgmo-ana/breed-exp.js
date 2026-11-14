(function(){
    var print = makePrint('breed-exp-dz', 'Avg breeding exp');
    function rate(rs) {
        var lo = 1;
        var tt = 0;
        for (var i = 0; i < rs.length; i++) {
            var cr = lo*rs[i].max_chance;
            //var cr = lo*rs[i].base_chance;
            tt += cr;
            lo -= cr;
        }
        return tt;
    }
    var pairs = [];
    var parentMap = {};
    var kidMap = {};
    for (var i = 0; i < pets.length; i++) {
        var pet = pets[i];
        if (!pet) continue;
        if (!pet.params || !pet.params.likes) continue;
        var ls = pet.params.likes;
        for (var j = 0; j < ls.length; j++) {
            var like = ls[j];
            var lv = pet.params.breeding_level;
            lv = Math.max(lv, pets[like.pet_id].params.breeding_level);
            parentMap['_'+i] = i;
            parentMap['_'+like.pet_id] = like.pet_id;
            for (var k = 0; k < like.returns.length; k++) {
                var rt = like.returns[k];
                kidMap['_'+rt.pet_id] = rt.pet_id;
            }
            pairs.push({
                lv: lv,
                name: pet.name + " x " + pets[like.pet_id].name,
                exp: Math.floor(like.xp * rate(like.returns))
            });
        }
    }
    function rateByLv(lv) {
        print.reset();
        var arr = [];
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if (pair.lv > lv) continue;
            arr.push(pair);
        }
        arr.sort(function(a, b){ return b.exp - a.exp; });
        for (var i = 0; i < arr.length; i++)
            print("lv: " + arr[i].lv + "; exp: " + arr[i].exp + "; name: " + arr[i].name);
    }
    rateByLv(60);
    var inp = document.createElement('input');
    document.getElementById('breed-exp-dz').childNodes[0].after(inp);
    inp.type = 'number';
    inp.min = 1;
    inp.value = 60;
    inp.addEventListener('input', function(){ rateByLv(inp.value); });
    var kids = Object.values(kidMap);
    for (var i = 0; i < kids.length; i++) {
        var kid = kids[i];
        if (parentMap['_'+kid])
            console.log(pets[kid].name);
    }
})();
