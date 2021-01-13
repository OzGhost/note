package ruf.pet;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Set;

@Path("/producer")
@Produces(MediaType.APPLICATION_JSON)
public class ProducerApi {

    @GET
    public Response create() {
        return Response.ok("Hello from producer").build();
    }
}
