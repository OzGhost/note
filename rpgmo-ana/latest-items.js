(function(){
    var arr = item_base;
    var size = 100;
    var print = makePrint('latest-items-dz', 'Latest items');
    for (var i = arr.length; i >=0 && size >=0; i--) {
        if (!arr[i]) continue;
        print(arr[i].name);
        size--;
    }
    var dz = 0;
})();
