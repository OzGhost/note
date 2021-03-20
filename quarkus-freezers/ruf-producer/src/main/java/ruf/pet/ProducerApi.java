package ruf.pet;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Set;

@Path("/producer/{id}")
@Produces(MediaType.APPLICATION_JSON)
public class ProducerApi {

    @POST
    public Response create(@HeaderParam("name") String name, @PathParam("id") String id, String msg) {
        if (true)
            return Response.status(400)
                        .entity("["+id+"] Something went wrong by producer as <"+name+"> with <"+msg+">!!!")
                        .build();
        return Response.ok("Hello from producer to <"+name+">: <"+msg+">").build();
    }
}
