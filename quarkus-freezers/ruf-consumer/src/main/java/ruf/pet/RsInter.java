package ruf.pet;

import io.vertx.core.http.HttpServerRequest;

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

@Provider
public class RsInter implements ClientResponseFilter {

    private static final Logger log = LoggerFactory.getLogger(RsInter.class);

    @Context
    UriInfo info;

    @Context
    HttpServerRequest request;

    @Override
    public void filter(ClientRequestContext rqContext, ClientResponseContext rsContext) {
        log.info("__[o0] rs inter kick in ...");
    }
}

