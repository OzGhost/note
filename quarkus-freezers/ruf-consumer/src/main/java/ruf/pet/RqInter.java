package ruf.pet;

import io.vertx.core.http.HttpServerRequest;

import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.ext.Provider;
import javax.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.ws.rs.ConstrainedTo;
import javax.ws.rs.RuntimeType;

@Provider
public class RqInter implements ClientRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RqInter.class);

    @Context
    UriInfo info;

    @Context
    HttpServerRequest request;

    @Inject
    Stamper stamper;

    @Override
    public void filter(ClientRequestContext context) {
        log.info("__[o0] rq inter kick in ...");
        stamper.loadRequestRenderer(() -> "MyRequest for you is nothing!!!");
    }
}

