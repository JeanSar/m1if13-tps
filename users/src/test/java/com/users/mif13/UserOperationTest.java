package com.users.mif13;


import com.users.mif13.controller.UserOperations;
import com.users.mif13.controller.UsersREST;
import com.users.mif13.model.Password;
import com.users.mif13.model.Token;
import com.users.mif13.model.UserAPI;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.LinkedMultiValueMap;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static utils.Utils.jsonBodyConstruct;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserOperationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsersREST usersREST;

    @Autowired
    private UserOperations userOperations;
    @Test
    void contextLoads1() {
        assertThat(userOperations).isNotNull();
    }

    @Test
    void contextLoads2() {
        assertThat(usersREST).isNotNull();
    }

    // Scnéario assez complet
    // (Plus bas quelques tests un peu plus spécifique)
    @Test
    public void testCreateUserThenLogin() throws Exception {
        UserAPI userAPI = new UserAPI();
        userAPI.login = "FlorianBis"; // Bis car sinon rentre en conflit avec les tests précédent lors du passage dans la pipeline
        userAPI.password = "1234";
        String requestBody = jsonBodyConstruct(userAPI);
        String origin = "http://localhost";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Origin", origin);
        this.mockMvc.perform(
                        post("/users/").content(requestBody).contentType(MediaType.APPLICATION_JSON_VALUE)
                )
                .andExpect(
                        status().isNoContent()
                );


        // On récupère le token (un peu comme "en vrai") cela dans le but de déconnecter plus tard
        Token token = new Token();
        token.jwt = this.mockMvc.perform(
                    post("/login").content(requestBody).contentType(MediaType.APPLICATION_JSON_VALUE).headers(headers)
                )
                .andExpect(
                        status().isNoContent()
                ).andReturn()
                .getResponse()
                .getHeader("Authorization")
                .split("Bearer ")[1]; // Retire "Bearer " devant le token

        Password newPassword = new Password();
        newPassword.password = "0000";
        String newPasswordJSON = jsonBodyConstruct(newPassword);


        this.mockMvc.perform(
                    put("/users/" + userAPI.login).content(newPasswordJSON).contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(
                        status().isNoContent()
                );

        this.mockMvc.perform(
                    post("/logout")
                            .content(jsonBodyConstruct(token))
                            .headers(headers)
                            .contentType(MediaType.APPLICATION_JSON_VALUE)
                )
                .andExpect(
                        status().isNoContent()
                );


        // Test connection avec ancien mot de passe. Retour attendu : 401 UNAUTHORIZED
        this.mockMvc.perform(
                    post("/login").content(requestBody).contentType(MediaType.APPLICATION_JSON_VALUE).headers(headers)
                )
                .andExpect(
                        status().isUnauthorized()
                );

        // Test avec le nouveau mot de passe
        UserAPI newUserApi = new UserAPI();
        newUserApi.login = userAPI.login;
        newUserApi.password = newPassword.password;

        token.jwt =  this.mockMvc.perform(
                        post("/login").content(jsonBodyConstruct(newUserApi)).contentType(MediaType.APPLICATION_JSON_VALUE).headers(headers)
                )
                .andExpect(
                        status().isNoContent()
                )
                .andReturn()
                .getResponse()
                .getHeader("Authorization")
                .split("Bearer ")[1]; // Retire "Bearer " devant le token

        // Enfin on test la route /authentificate
        LinkedMultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("jwt", token.jwt);
        params.add("origin", origin);
        this.mockMvc.perform(
                        get("/authenticate").params(params)
                )
                .andExpect(
                        status().isNoContent()
                );

        // On se déconnecte puis on reteste authentificate (on doit avoir une erreur 401 avec un log approprié)
        this.mockMvc.perform(
                        post("/logout")
                                .content(jsonBodyConstruct(token))
                                .headers(headers)
                                .contentType(MediaType.APPLICATION_JSON_VALUE)
                )
                .andExpect(
                        status().isNoContent()
                );

        this.mockMvc.perform(
                        get("/authenticate").params(params)
                )
                .andExpect(
                        status().isUnauthorized()
                );

    }
}
