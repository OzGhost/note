function validBash(xs, wlist) {
    var inp = xs + "";
    var len = xs.length;
    var buf = "";
    var qCtx = '';
    var cmds = [];
    for (var i = 0; i < len; i++) {
        var c = inp.charAt(i);
        if ((c == '|' || c == ';' || c == '\n') && !qCtx) {
            cmds.push(buf);
            buf = "";
            continue;
        }
        if (c == '&' && !qCtx) {
            if ((i+1) < len && inp.charAt(i+1) == '&')
                i++;
            cmds.push(buf);
            buf = "";
            continue;
        }
        if (c == '`' && qCtx != "'")
            return "Command substitution with backctick was banned!";
        if (c == '$' && (i+1) < len && inp.charAt(i+1) == '(' &&  qCtx != "'")
            return "Command substitution with dolar expression was banned!";
        if ((c == '"' || c == "'") && !qCtx) {
            qCtx = c;
            continue;
        }
        if (qCtx && c == qCtx)
            if (c == "'" || inp.charAt(i-1) != '\\') {
                qCtx = '';
                continue;
            }
        if (qCtx) switch (c) {
            case ' ':
            case '\n':
                buf += '_';
                continue
            default: break;
        }
        buf += c;
    }
    if (buf.length)
        cmds.push(buf);
    var msg;
    for (var j = 0; j < cmds.length; j++)
        if (msg = validCmd(cmds[j], wlist))
            return msg;
    return "";
}

function validCmd(cmd, wlist) {
    console.log("check cmd: ", cmd);
    var args = cmd.trim().split(' ');
    if (!args.length)
        return "";
    if (!wlist[args[0]])
        return "Command >"+args[0]+"< was banned!"
    for (var i = 1; i < args.length; i++) {
        var arg = args[i];
        if (arg == "2>&1")
            continue;
        if (arg.startsWith('>>') || arg.startsWith('1>') || arg.startsWith('2>'))
            arg = arg.substr(2);
        else if (arg.startsWith('>') || arg.startsWith('<') || arg.startsWith('{'))
            arg = arg.substr(1);
        var msg = validArg(arg);
        if (msg)
            return msg;
    }
    return "";
}

function validArg(arg) {
    console.log("__ check arg: ", arg);
    if (arg == '..')
        return "Parent path traversal was banned!";
    if (!arg.length)
        return "";
    var c = arg.charAt(0);
    if (c == '/' || c == '~' || /\${?\w+}?/.test(arg))
        return "Absolute path was banned!";
    var ps = arg.split('/');
    for (var i = 0; i < ps.length; i++)
        if (ps[i] == '..')
            return "Parent path traversal was banned!";
    var idx = arg.indexOf('=');
    if (idx < 0)
        return "";
    return validArg(arg.substr(idx+1));
}
