package pup;

import java.io.File;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

public class Pup {

    private static final LinkedBlockingQueue<Object> q = new LinkedBlockingQueue<>();
    private static final String ofp = System.getProperty("java.io.tmpdir") + File.separator + "inner_pup.log";
    private static volatile Thread t;

    public static void bark(Object o) {
    	if (t == null) {
    		synchronized(Pup.class) {
    			if (t == null) {
    				t = new Thread(new Writer(q));
    				t.start();
    			}
    		}
    	}
        try { q.offer(o, 30, TimeUnit.SECONDS); } catch(Throwable ignored){}
    }
    
    public static void bark(Object o, boolean b) {
    	try { write(o); } catch(Exception ingored) {}
    }

    public static void bark() {
        try {
            throw new UnsupportedOperationException("WAG");
        } catch(Throwable e) {
            bark(e);
        }
    }

    private static void write(Object x) throws Exception {
        try (FileOutputStream fos = new FileOutputStream(ofp, true); PrintStream ps = new PrintStream(fos, true)) {
            if (x instanceof Throwable) {
                ((Throwable) x).printStackTrace(ps);
            } else {
                String sx = ""+x;
                ps.println(sx);
            }
        }
    }
    
    private static class Writer implements Runnable {
        private final LinkedBlockingQueue<Object> q;

        Writer(LinkedBlockingQueue<Object> oq) {
            q = oq;
        }

        @Override
        public void run() {
            Thread me = Thread.currentThread();
            try { write("=.= Writer installation completed! =.="); } catch(Exception e) { e.printStackTrace(); }
            while (!me.isInterrupted() || !q.isEmpty()) {
                try {
                    Object x = q.poll(30, TimeUnit.SECONDS);
                    if (x != null) write(x);
                } catch(Throwable outer) {
                    outer.printStackTrace();
                }
            }
        }
    }
}

