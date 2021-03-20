package ruf.pet;

import io.vertx.core.http.HttpServerRequest;

import java.io.*;
import java.util.List;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.ws.rs.client.ClientResponseContext;
import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientResponseFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.ext.Provider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.ws.rs.ConstrainedTo;
import javax.ws.rs.RuntimeType;
import javax.inject.Inject;

@Provider
public class RsInter implements ClientResponseFilter {

    private static final Logger log = LoggerFactory.getLogger(RsInter.class);

    @Context UriInfo info;
    @Context HttpServerRequest request;
    @Inject Stamper stamper;
    @Inject ObjectMapper mapper;

    @Override
    public void filter(ClientRequestContext rqCtx, ClientResponseContext rsCtx) {
        StringBuilder sb = new StringBuilder();
        wl(sb, "---- rq uri: " + rqCtx.getUri());
        wl(sb, "---- rq header ----");
        wl(sb, extractHeaders(rqCtx));
        wl(sb, "---- rq body ----");
        wl(sb, extractBody(rqCtx));
        wl(sb, "---- rs status: " + rsCtx.getStatus());
        wl(sb, "---- rs header ----");
        wl(sb, extractHeaders(rsCtx));
        wl(sb, "---- rs body ----");
        wl(sb, extractBody(rsCtx));
        wl(sb, "---- end ----");
        log.warn("__[xx] Crashed" + sb.toString());
    }

    private String wrap(String inside) {
        return "<" + inside + ">";
    }

    private String wrap(List<String> vals) {
        List<String> v = vals.stream().map(x -> wrap(x)).collect(Collectors.toList());
        return "[" + String.join(",", v) + "]";
    }

    private String extractHeaders(ClientRequestContext rqCtx) {
        List<String> headers = rqCtx.getStringHeaders()
            .entrySet()
            .stream()
            .map(x -> wrap(x.getKey()) + ": " + wrap(x.getValue()))
            .collect(Collectors.toList());
        return String.join("\n", headers);
    }

    private String extractHeaders(ClientResponseContext rsCtx) {
        List<String> headers = rsCtx.getHeaders()
            .entrySet()
            .stream()
            .map(x -> wrap(x.getKey()) + ": " + wrap(x.getValue()))
            .collect(Collectors.toList());
        return String.join("\n", headers);
    }

    private String extractBody(ClientRequestContext rqCtx) {
        if (!rqCtx.hasEntity()) {
            return "<nobody>";
        }
        String body = "";
        try { body = mapper.writeValueAsString(rqCtx.getEntity()); }
        catch (Throwable e) { body = "<unparseable entity>"; }
        return body;
    }

    private String extractBody(ClientResponseContext rsCtx) {
        if (!rsCtx.hasEntity()) {
            return "<nobody>";
        }
        String body = "";
        try {
        InputStream is = rsCtx.getEntityStream();
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        is.transferTo(os);
        rsCtx.setEntityStream(new ByteArrayInputStream(os.toByteArray()));
        body = os.toString();
        } catch (Throwable e) { body = "<unparseable entity>"; }
        return body;
    }

    private void wl(StringBuilder sb, String m) {
        sb.append('\n').append(m);
    }
}

