package ruf.pet;

import javax.inject.Singleton;
import java.util.function.Supplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Singleton
public class Stamper {
    private static final Logger log = LoggerFactory.getLogger(Stamper.class);
    private static ThreadLocal<Renderer> cr = new ThreadLocal<>();
    
    private static class Renderer {
        private Supplier<String> rqRenderer = () -> "No request renderer available!!!";
        private Supplier<String> rsRenderer = () -> "No response renderer available!!!";
    }

    public void surround(Runnable runner) {
        try {
            cr.set(new Renderer());
            runner.run();
        } catch(javax.ws.rs.WebApplicationException e) {
            Renderer r = cr.get();
            log.error(r.rqRenderer.get());
            log.error(r.rsRenderer.get());
            throw e;
        }
    }

    public void loadRequestRenderer(Supplier<String> rqRenderer) {
        Renderer r = cr.get();
        if (r != null) {
            r.rqRenderer = rqRenderer;
        }
    }

    public void loadResponseRenderer(Supplier<String> rsRenderer) {
        Renderer r = cr.get();
        if (r != null) {
            r.rsRenderer = rsRenderer;
        }
    }
}
