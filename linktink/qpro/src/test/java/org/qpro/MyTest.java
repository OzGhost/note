package org.qpro;

import org.junit.Test;
import java.io.*;
import java.util.*;

public class MyTest {
    
    @Test
    public void askFor() throws Exception {
        String p = "src/test/resources/ioset";
		Map<String, File[]> rmap = new HashMap<>();
		for (File f: new File(p).listFiles()) {
			String[] namep = f.getName().split("\\.");
			if (namep.length != 2) continue;
			int si = -1;
			if ("inp".equals(namep[1])) {
				si = 0;
			} else if("out".equals(namep[1])) {
				si = 1;
			}
			if (si == -1) continue;
			File[] storage = rmap.get(namep[0]);
			if (storage == null) {
				storage = new File[2];
				rmap.put(namep[0], storage);
			}
			storage[si] = f;
		}
		YourAnswer shooter = new YourAnswer();
        boolean allowWarmUp = false;
        if (allowWarmUp) {
            String wuf = p + "/ioset_01.inp";
            String wuo = p + "/ioset_01.ans";
            if (new File(wuf).exists()) {
                for (int i = 0; i < 20; i++) {
                    try (InputStream qis = new FileInputStream(wuf); OutputStream aos = new FileOutputStream(wuo)) {
                        shooter.answerTo(qis, aos);
                    } catch(Throwable ignored) {}
                }
            }
        }
		Map<String, Object[]> rs = new HashMap<>();
		for (Map.Entry<String, File[]> e: rmap.entrySet()) {
			String name = e.getKey();
			String ans = e.getValue()[1].getAbsolutePath().replaceAll("out$", "ans");
			try (InputStream qis = new FileInputStream(e.getValue()[0]); OutputStream aos = new FileOutputStream(ans)) {
				long b = System.nanoTime();
				shooter.answerTo(qis, aos);
				long du = System.nanoTime() - b;
				rs.put(name, new Object[]{du, ""});
			}
			try (InputStream eis = new FileInputStream(e.getValue()[1]); InputStream ais = new FileInputStream(ans)) {
				int ex, an;
				ex = an = 0;
				boolean broken = false;
				String ew = "";
				while ( (ex = eis.read()) != -1 && (an = ais.read()) != -1 ) {
					if (ex != an) {
						ew = "Incorrect";
						broken = true;
						break;
					}
				}
				if (!broken) {
					if (ex != -1 || (an = ais.read()) != -1) {
						ew = "Incorrect";
					} else {
						ew = "Correct";
					}
				}
				rs.get(name)[1] = ew;
			}
		}
		boolean failed = false;
		for (Map.Entry<String, Object[]> e: rs.entrySet()) {
			System.out.println(e.getKey() + " -> " + e.getValue()[1] + " -> " + e.getValue()[0]);
			if ( ! "Correct".equals(e.getValue()[1])) {
				failed = true;
			}
		}
		if (failed) org.junit.Assert.fail();
    }
}

