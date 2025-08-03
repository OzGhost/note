(function(){
    var inp = [54, 3, 33, 75, 17, 2, 29, 69, 89, 39, 21, 62, 22, 35, 97];

    var tree = null;
    for (var i =0; i <inp.length; i++) {
        console.log("insert v=", inp[i]);
        tree = insert(tree, inp[i]).n;
        console.log("\n\nafter step: ", i);
        show(tree, "");
    }

    function insert(tree, val) {
        if (!tree)
            return {n:{v:val,d:0},x:1};
        var bp;
        if (val < tree.v) {
            bp = insert(tree.left, val);
            tree.left = bp.n;
            bp.x && tree.d--;
        } else {
            bp = insert(tree.right, val);
            tree.right = bp.n;
            bp.x && tree.d++;
        }
        if (tree.d < -1)
            return {n:rrotate(tree, 1),x:0};
        if (tree.d > 1)
            return {n:lrotate(tree, 1),x:0};
        var x = (bp.x && tree.d != 0) ? 1 : 0;
        return {n:tree,x:x};
    }
    function show(tree, space) {
        if (!tree)
            return;
        show(tree.right, space + "--- ");
        console.log(space + tree.v + "|"+tree.d);
        show(tree.left, space + "--- ");
    }
    function rrotate(tree, cascade) {
        if (!tree.left) {
            console.warn("no left branch to do right rotation at node=", tree.v);
            return tree;
        }
        console.log("before rr at node=", tree.v);
        show(tree,"> ");
        if (cascade && tree.left.d > 0) {
            console.log("__ prepare rr by a 1-step lr at node=", tree.left.v);
            tree.left = lrotate(tree.left, 0);
        }
        var next = tree.left;
        tree.left = next.right;
        next.right = tree;
        var orootD = tree.d;
        var osublD = next.d;
        /**
          root.l <- n
          root.r <- n + root.d
          bran.d < 0
            ? bran.l <- n - 1
              bran.r <- n - 1 + bran.d
            : bran.l <- n - 1 - bran.d
              bran.r <- n - 1

          >> bran.r | root.r
            bran.d < 0
                ? n - 1 + bran.d | n + root.d
                : n - 1 | n + root.d
          >> bran.l | 1 + reroot
            bran.d < 0
                ? reroot.d < 0
                    ? n - 1 | 1 + n + root.d - reroot.d
                    : n - 1 | 1 + n + root.d
                : reroot.d < 0
                    ? n - 1 - bran.d | 1 + n + root.d - reroot.d
                    : n - 1 - bran.d | 1 + n + root.d
          */
        tree.d = osublD < 0 ? (orootD - osublD + 1) : (orootD + 1);
        if (osublD < 0)
            next.d = tree.d < 0 ? (2 + orootD - tree.d) : (2 + orootD);
        else
            next.d = tree.d < 0 ? (2 + orootD - tree.d + osublD) : (2 + orootD + osublD);
        console.log("after rr");
        show(next,"> ");
        return next;
    }
    function lrotate(tree, cascade) {
        if (!tree.right) {
            console.warn("no right branch to do left rotation at node=", tree.v);
            return tree;
        }
        console.log("before lr at node=", tree.v);
        show(tree,"> ");
        if (cascade && tree.right.d < 0) {
            console.log("__ prepare lr by a 1-step rr at node=", tree.right.v);
            tree.right = rrotate(tree.right, 0);
        }
        var next = tree.right;
        tree.right = next.left;
        next.left = tree;
        var orootD = tree.d;
        var osubrD = next.d;
        /**
          root.l <- n
          root.r <- n + root.d
          bran.d < 0
            ? bran.l <- n + root.d - 1
              bran.r <- n + root.d - 1 + bran.d
            : bran.l <- n + root.d - 1 - bran.d
              bran.r <- n + root.d - 1

          ---
          >> root.l vs bran.l
            bran.d < 0
                ? n vs n + root.d - 1
                : n vs n + root.d - 1 - bran.d

          >> reroot + 1 vs bran.r
            reroot.d < 0
                ? root.l + 1 vs bran.r
                    bran.d < 0
                        ? n + 1 vs n + root.d - 1 + bran.d
                        : n + 1 vs n + root.d - 1
                : root.l + 1 + reroot.d vs bran.r
                    bran.d < 0
                        ? n + 1 + reroot.d vs n + root.d - 1 + bran.d
                        : n + 1 + reroot.d vs n + root.d - 1
          */
        tree.d = osubrD < 0 ? (orootD - 1) : (orootD - 1 - osubrD);
        if (tree.d < 0)
            next.d = osubrD < 0 ? (orootD - 2 + osubrD) : (orootD - 2);
        else
            next.d = osubrD < 0 ? (orootD - 2 + osubrD - tree.d) : (orootD - 2 - tree.d);
        console.log("after lr");
        show(next,"> ");
        return next;
    }
})()
