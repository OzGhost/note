package ruf.pet;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import javax.ws.rs.*;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

@Path("/producer/{id}")
@RegisterRestClient(configKey="producer-api")
public interface ProducerClient {

    @POST
    String get(@PathParam("id") String id, @HeaderParam("name") String name, String msg);
}
