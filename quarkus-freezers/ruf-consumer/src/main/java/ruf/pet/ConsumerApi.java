package ruf.pet;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Set;

import javax.inject.Inject;
import org.eclipse.microprofile.rest.client.inject.RestClient;

@Path("/consumer")
@Produces(MediaType.APPLICATION_JSON)
public class ConsumerApi {

    private ProducerClient client;

    @Inject
    public ConsumerApi(@RestClient ProducerClient client) {
        this.client = client;
    }

    @GET
    public Response digest() {
        client.get();
        return Response.ok("Hello from consumer").build();
    }
}
