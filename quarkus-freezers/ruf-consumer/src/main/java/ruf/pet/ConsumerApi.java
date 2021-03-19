package ruf.pet;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Set;

import javax.inject.Inject;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Path("/consumer")
@Produces(MediaType.APPLICATION_JSON)
public class ConsumerApi {

    private static final Logger log = LoggerFactory.getLogger(ConsumerApi.class);

    private ProducerClient client;
    private Stamper stamper;

    @Inject
    public ConsumerApi(@RestClient ProducerClient client, Stamper stamper) {
        this.client = client;
        this.stamper = stamper;
        log.info("__[o0] new api instance created ...");
    }

    @GET
    public Response digest() {
        log.info("__[o0] start ...");
        String[] v = new String[1];
        stamper.surround(() -> v[0] = client.get());
        Response r = Response.ok("Hello from consumer >> " + v[0]).build();
        log.info("__[o0] end ...");
        return r;
    }
}
