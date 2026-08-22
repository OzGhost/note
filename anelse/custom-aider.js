(function(){
 var originTxt = [
 "function createRateLimiter(limit, intervalMs) {",
 "  const queue = [];",
 "  let activeCount = 0;",
 "",
 "  function processQueue() {",
 "    if (queue.length === 0 || activeCount >= limit) return;",
 "",
 "    activeCount++;",
 "    const { fn, resolve, reject, args } = queue.shift();",
 "",
 "    // Execute the function",
 "    Promise.resolve()",
 "      .then(() => fn(...args))",
 "      .then(resolve)",
 "      .catch(reject)",
 "      .finally(() => {",
 "        // Release capacity after intervalMs",
 "        setTimeout(() => {",
 "          activeCount--;",
 "          processQueue();",
 "        }, intervalMs);",
 "      });",
 "  }",
 "",
 "  return function rateLimitedFn(fn, ...args) {",
 "    return new Promise((resolve, reject) => {",
 "      queue.push({ fn, resolve, reject, args });",
 "      processQueue();",
 "    });",
 "  };",
 "}",
 ];

    var blocks = "";
    blocks += "<<<<<<< SEARCH 13\n";
    blocks += "      .then(() => fn(...args))\n";
    blocks += "      .then(resolve)\n";
    blocks += "      .catch(reject)\n";
    blocks += "=======\n";
    blocks += "      .then(() => apply(null, fn, args))\n";
    blocks += "      .then(resolve, reject)\n";
    blocks += ">>>>>>> REPLACE\n";

    function customAiderExtor(lines, bs) {
        var bls = bs.split(/\r?\n/);
        var seaBl = [];
        var repBl = [];
        var receiver = null;
        var lineNo = -1;
        for (var i = 0; i < bls.length; i++) {
            var bline = bls[i];
            if (bline.startsWith("<<<<<<< SEARCH")) {
                lineNo = extractLineNo(bline);
                if (lineNo < 0)
                    throw new Error("Invalid block: search block's headline contain no/invalid line number");
                receiver = seaBl;
                continue;
            }
            if (bline.startsWith("=======")) {
                receiver = repBl;
                continue;
            }
            if (bline.startsWith(">>>>>>> REPLACE")) {
                break;
            }
            if (receiver) receiver.push(bline);
        }
        if (!seaBl.length)
            throw new Error("Invalid block: search block is empty");
        if (lineNo-1 >= lines.length)
            throw new Error(`Invalid block: line number ${lineNo} not found, file only have ${1+lines.length} lines`);
        if (!matchSearchBlock(lines, lineNo, seaBl))
            throw toError(lines, lineNo, seaBl.length);

        console.log("... the replacement will come later");
    };
    function extractLineNo(line) {
        if (line.length < 16)
            return -1;
        var buf = "";
        for (var i = 15; i < line.length; i++) {
            var c = line.charAt(i);
            if (c < '0' || c > '9')
                break;
            buf += c;
        }
        return +buf;
    }
    function matchSearchBlock(lines, lineNo, seaBl) {
        var idx = lineNo-1;
        if ((lines.length - idx) < seaBl.length)
            return false;
        for (var i = 0; i < seaBl.length; i++) {
            var left = strip(lines[idx+i]);
            var right = strip(seaBl[i]);
            if (left != right) {
                console.log(idx+i, i, [left, right]);
                return false;
            }
        }
        return true;
    }
    function toError(lines, lineNo, seaSize) {
        var msg = `Cannot find given search block, the actual content at line number ${lineNo} is below:\n`;
        var len = Math.min(10, seaSize);
        var max = Math.min(lines.length, lineNo-1+len);
        msg += "```\n";
        for (var i = lineNo-1; i < max; i++)
            msg += lines[i] + "\n";
        msg += "```\n";
        return new Error(msg);
    }
    function strip(txt) {
        var head = 0;
        var tail = txt.length;
        for (var i = 0; i < txt.length; i++) {
            var c = txt.charAt(i);
            if (c == ' ' || c == '\t')
                head++;
            else break;
        }
        if (head >= txt.length)
            return "";
        for (var i = txt.length-1; i >= 0; i--) {
            var c = txt.charAt(i);
            if (c == ' ' || c == '\t')
                tail--;
            else break;
        }
        return txt.substring(head,tail);
    }

    customAiderExtor(originTxt, blocks);
})();
