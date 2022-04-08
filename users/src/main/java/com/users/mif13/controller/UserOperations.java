package com.users.mif13.controller;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.users.mif13.DAO.UserDAO;
import com.users.mif13.model.Token;
import com.users.mif13.model.User;
import com.users.mif13.model.UserAPI;
import com.users.mif13.utils.JwtHelper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.headers.Header;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.InternalServerErrorException;
// Si on met seulement l'annotation @Controller, la donc n'est pas généré pour tout les contenue
// ie url encoded et json
@RestController
@CrossOrigin
public class UserOperations {

    @Autowired
    private UserDAO dao;

    /**
     * Procédure de login utilisée par un utilisateur
     *
     * @param login    Le login de l'utilisateur. L'utilisateur doit avoir été créé préalablement et son login doit être présent dans le DAO.
     * @param password Le password à vérifier.
     * @return Une ResponseEntity avec le JWT dans le header "Authentication" si le login s'est bien passé, et le code de statut approprié (204, 401 ou 404).
     */
    @PostMapping(value = "/login", consumes = {MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    // @CrossOrigin(origins = {"http://localhost", "https://192.168.75.13", "http://192.168.75.13"})
    @Operation(summary = "Se connecter avec son login")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Connexion réussi : le token est renvoyé.", headers = {
                    @Header( name = "Authorization", description = "Token jwt", schema = @Schema( implementation = String.class)),
                    @Header( name = "Access-Control-Expose-Headers", description = "Origin validé permettant l'accès aux headers", schema = @Schema( implementation = String.class))},
                    content = @Content(mediaType =  "application/json")),
            @ApiResponse(responseCode = "404", description = "Le login de l'utilisateur n'existe pas.",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Le mot de passe ne correspond pas au login.",
                    content = @Content)})
    public ResponseEntity<Void> login(@Parameter( description = "Le login de l'utilisateur")
                                      @io.swagger.v3.oas.annotations.parameters.RequestBody String login,
                                      @Parameter( description = "Le mot de passe associé au login")
                                      @io.swagger.v3.oas.annotations.parameters.RequestBody String password,
                                      @Parameter( description = "En-tête Origin")
                                      @RequestHeader("Origin") String origin) {
        if (dao.get(login).isPresent()) {
            try {
                User user = dao.get(login).get();
                user.authenticate(password);
                if (!user.isConnected()) {
                    throw new InternalServerErrorException();
                }
                String token = JwtHelper.generateToken(login, false, origin);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + token);
                headers.add(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, origin);
                return new ResponseEntity<>(headers, HttpStatus.NO_CONTENT);// succeed : 204
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // bad password : 401
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // user not found : 404
        }
    }

    // @CrossOrigin(origins = {"http://localhost", "https://192.168.75.13", "http://192.168.75.13"})
    @PostMapping(value = "/login", consumes = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Void> loginJSON(@RequestBody UserAPI userAPI,
                                          @RequestHeader("Origin") String origin) {
        if (dao.get(userAPI.login).isPresent()) {
            try {
                User user = dao.get(userAPI.login).get();
                user.authenticate(userAPI.password);
                if (!user.isConnected()) {
                    throw new InternalServerErrorException();
                }
                String token = JwtHelper.generateToken(userAPI.login, false, origin);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + token);
                headers.add(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Authorization");
                return new ResponseEntity<>(headers, HttpStatus.NO_CONTENT);// succeed : 204
            } catch (Exception e) {
                System.out.println("Error password, excecption catch and return error code 401 unauthorized");
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // bad password : 401
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // user not found : 404
        }
    }

    /**
     * Réalise la déconnexion
     *
     * @param jwt    Le token JWT qui se trouve dans le header "Authentication" de la requête
     * @param origin L'origine de la requête (pour la comparer avec celle du client, stockée dans le token JWT)
     * @return Une réponse vide avec un code de statut approprié (204, 400, 401).
     */
    @PostMapping(value = "/logout", consumes = {MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    // @CrossOrigin(origins = {"http://localhost", "https://192.168.75.13", "http://192.168.75.13"})
    @Operation(summary = "Se deconnecter avec le token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Déconnexion reussi.",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Le login de l'utilisateur n'existe pas.",
                    content = @Content),
            @ApiResponse(responseCode = "400", description = "Le token est invalide.",
                    content = @Content)})
    public ResponseEntity<Void> logout(@Parameter( description = "Token d'authentification jwt")
                                       @io.swagger.v3.oas.annotations.parameters.RequestBody String jwt,
                                       @Parameter( description = "En-tête Origin")
                                       @RequestHeader("Origin") String origin) {
        try {
            String login = JwtHelper.verifyToken(jwt, origin);
            if (login.isEmpty()) {
                throw new InternalServerErrorException();
            }
            if (dao.get(login).isPresent()) {
                dao.get(login).get().disconnect();
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Déconnecté : 204
            }
            System.out.println("Tentative de déconnection d'un utilisateur inexistant");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // L'utilisateur n'existe pas : 401
        } catch (NullPointerException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // Le token n'existe pas : 401
        } catch (JWTVerificationException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Le token est invalide : 400
        }
    }

    @PostMapping(value = "/logout", consumes = {MediaType.APPLICATION_JSON_VALUE})
    // @CrossOrigin(origins = {"http://localhost", "https://192.168.75.13", "http://192.168.75.13"})
    public ResponseEntity<Void> logoutJSON( @RequestBody Token token,
                                            @RequestHeader("Origin") String origin) {
        try {
            String login = JwtHelper.verifyToken(token.jwt, origin);
            if(login.isEmpty()){
                throw new InternalServerErrorException();
            }
            if (dao.get(login).isPresent()) {
                dao.get(login).get().disconnect();
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Déconnecté : 204
            }
            System.out.println("Tentative de déconnection d'un utilisateur inexistant");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // L'utilisateur n'existe pas : 401
        } catch (NullPointerException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // Le token n'existe pas : 401
        } catch (JWTVerificationException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Le token est invalide : 400
        }
    }

    /**
     * Méthode destinée au serveur Node pour valider l'authentification d'un utilisateur.
     *
     * @param jwt    Le token JWT qui se trouve dans le header "Authentication" de la requête
     * @param origin L'origine de la requête (pour la comparer avec celle du client, stockée dans le token JWT)
     * @return Une réponse vide avec un code de statut approprié (204, 400, 401).
     */
    @GetMapping("/authenticate")
    // @CrossOrigin(origins = {"http://localhost", "https://192.168.75.13", "http://192.168.75.13"})
    @Operation(summary = "S'authentifier avec le token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Authentification réussi.",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Le login de l'utilisateur n'existe pas.",
                    content = @Content),
            @ApiResponse(responseCode = "400", description = "Le token est invalide.",
                    content = @Content)})
    public ResponseEntity<Void> authenticate(@Parameter( description = "Token d'authentification jwt" )
                                             @RequestParam("jwt") String jwt,
                                             @Parameter( description = "En-tête Origin" )
                                             @RequestParam("origin") String origin) {
        try {
            String login = JwtHelper.verifyToken(jwt, origin);
            if (login.isEmpty()) {
                throw new InternalServerErrorException();
            }
            if (dao.get(login).isPresent() && dao.get(login).get().isConnected()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Authentifié : 204
            }
            System.out.println("Tentative de connection d'un utilisateur déconnecté ou inexistant");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // L'utilisateur n'est pas connecté ou n'existe pas : 401
        } catch (NullPointerException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // Le token n'existe pas : 401
        } catch (JWTVerificationException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Le token est invalide : 400
        }
    }
}