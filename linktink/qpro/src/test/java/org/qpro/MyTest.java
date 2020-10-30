package org.qpro;

import org.junit.Test;
import java.io.*;
import java.util.*;
import java.nio.file.Files;

public class MyTest {

    @Test
    public void firstCase() throws Exception {
        String p = "src/test/resources/lipsum.txt";
        String content = Files.readString(new File(p).toPath());
        content = content.replace('\n', ' ');
        Set<String> uniq = new HashSet<>();
        int c = 0;
        for (String i: content.split("[^a-zA-Z]")) {
            String j = i.trim().toLowerCase();
            if ( ! j.isEmpty()) {
                uniq.add(j);
                c++;
            }
        }
        String[] dict = uniq.toArray(new String[uniq.size()]);
        Random r = new Random();
        int z = 10;
        int hz = z/2;
        int n = r.nextInt(hz)+hz;
        int m = r.nextInt(hz)+hz;
        int l = n+m-r.nextInt(Math.min(n,m));
        int nr = n;
        int mr = m;
        if (l > dict.length) {
            hz = dict.length/2;
            n = r.nextInt(hz)+1;
            m = r.nextInt(hz)+1;
            l = n+m-r.nextInt(Math.min(n,m));
        }
        String tmp = null;
        int ti = 0;
        for (int i = 0; i < l; i++) {
            ti = r.nextInt(dict.length);
            tmp = dict[i];
            dict[i] = dict[ti];
            dict[ti] = tmp;
        }
        String[] nc = new String[nr];
        String[] mc = new String[mr];
        System.arraycopy(dict, 0, nc, 0, n);
        System.arraycopy(dict, l-m, mc, 0, m);
        int buf = n+m-l;
        String ans = (n-buf) + " " + (m-buf) + " " + buf;
        for (int i = n; i < nr; i++) {
            nc[i] = nc[r.nextInt(n)];
        }
        for (int i = m; i < mr; i++) {
            mc[i] = mc[r.nextInt(m)];
        }
        for (int i = 0; i < nr; i++) {
            ti = r.nextInt(nr);
            tmp = nc[i];
            nc[i] = nc[ti];
            nc[ti] = tmp;
        }
        for (int i = 0; i < mr; i++) {
            ti = r.nextInt(mr);
            tmp = mc[i];
            mc[i] = mc[ti];
            mc[ti] = tmp;
        }
        // under construction
        System.out.println("[o0] dict: " + l);
        for (int i = 0; i < l; i++) {
            System.out.print(" " + dict[i]);
        }
        System.out.println("\n[o0] nr:" + nr);
        for (int i = 0; i < nr; i++) {
            System.out.print(" " + nc[i]);
        }
        System.out.println("\n[o0] m:" + mr);
        for (int i = 0; i < mr; i++) {
            System.out.print(" " + mc[i]);
        }
        System.out.println();
        System.out.println(ans);
    }

}

