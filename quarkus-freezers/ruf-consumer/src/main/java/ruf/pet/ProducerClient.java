package ruf.pet;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

@Path("/producer")
@RegisterRestClient(configKey="producer-api")
public interface ProducerClient {

    @GET
    void get();
}
