package com.users.mif13;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.users.mif13.controller.UsersREST;
import com.users.mif13.model.User;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class UsersRESTTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsersREST usersREST;

    @Test
    @Order(1)
    void contextLoads() {
        assertThat(usersREST).isNotNull();
    }

    private String jsonBodyConstruct(Object object) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectWriter objectWriter = objectMapper.writer().withDefaultPrettyPrinter();
        return objectWriter.writeValueAsString(object);
    }

    @Test
    @Order(2)
    public void testGetAllEndPoint() throws Exception {
        this.mockMvc.perform(
                        get("/users/list")
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$[0]", is("Susan"))
                )
                .andExpect(
                        jsonPath("$[1]", is("John"))
                );
    }

    @Test
    @Order(3)
    public void testGetOneEndPoint() throws Exception {
        this.mockMvc.perform(
                        get("/users/getOne?login=Susan")
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.login", is("Susan"))
                )
                .andExpect(
                        jsonPath("$.connected", is(false))
                );

        this.mockMvc.perform(
                        get("/users/getOne?login=John")
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.login", is("John"))
                )
                .andExpect(
                        jsonPath("$.connected", is(false))
                );
    }


    @Test
    @Order(4)
    public void testDeleteUser() throws Exception {
        this.mockMvc.perform(
                        delete("/users/Susan")
                )
                .andExpect(
                        status().isNoContent()
                );

        this.mockMvc.perform(
                        get("/users/getOne?login=Susan")
                )
                .andExpect(
                        status().isBadRequest()
                );

        this.mockMvc.perform(
                        get("/users/list")
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        // A l'initialisation du serveur, on ajoute 2 utilsateurs (Susan et John)
                        // Donc si on en supprime un, la taille du tableau renvoyé doit être de 1
                        jsonPath("$", hasSize(1))
                )
                .andExpect(
                        jsonPath("$[0]", is("John"))
                );
    }

    @Test
    @Order(5)
    public void testCreateUser() throws Exception {
        String requestBody = jsonBodyConstruct(new User("Florian", "1234"));

        this.mockMvc.perform(
                        post("/users/").content(requestBody).contentType(MediaType.APPLICATION_JSON_VALUE).content(requestBody)
                )
                .andExpect(
                        status().isNoContent()
                );

        this.mockMvc.perform(
                        get("/users/getOne?login=Florian")
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.login", is("Florian"))
                )
                .andExpect(
                        jsonPath("$.connected", is(false))
                );
    }

    // Méthode PUT pour modifier le password est testé dans userOperation car le seul moyen de vérifier
    // qu'un mot de passe est bien modifier est de  tenter de se connecter avec ce nouveau mot de passe
}
