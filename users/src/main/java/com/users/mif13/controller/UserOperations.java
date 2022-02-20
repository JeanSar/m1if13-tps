package com.users.mif13.controller;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.users.mif13.DAO.UserDAO;
import com.users.mif13.model.User;
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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.InternalServerErrorException;
import java.util.Optional;

@Controller
public class UserOperations {

    // TODO - Changer les @QueryParam en @RequestBody
    @Autowired
    private UserDAO dao;

    /**
     * Procédure de login utilisée par un utilisateur
     *
     * @param login    Le login de l'utilisateur. L'utilisateur doit avoir été créé préalablement et son login doit être présent dans le DAO.
     * @param password Le password à vérifier.
     * @return Une ResponseEntity avec le JWT dans le header "Authentication" si le login s'est bien passé, et le code de statut approprié (204, 401 ou 404).
     */
    @PostMapping("/login")
    @CrossOrigin(origins = {"http://localhost", "https://192.168.75.13", "http://192.168.75.13"})
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
                                      @RequestParam("login") String login,
                                      @Parameter( description = "Le mot de passe associé au login")
                                      @RequestParam("password") String password,
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
                e.getMessage();
                e.printStackTrace();
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
    @PostMapping("/logout")
    @CrossOrigin(origins = {"http://localhost", "https://192.168.75.13", "http://192.168.75.13"})
    @Operation(summary = "Se deconnecter avec le token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Déconnexion reussi.",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Le login de l'utilisateur n'existe pas.",
                    content = @Content),
            @ApiResponse(responseCode = "400", description = "Le token est invalide.",
                    content = @Content)})
    public ResponseEntity<Void> logout(@Parameter( description = "Token d'authentification jwt")
                                       @RequestParam("jwt") String jwt,
                                       @Parameter( description = "En-tête Origin")
                                       @RequestHeader("Origin") String origin) {
        try {
            String login = JwtHelper.verifyToken(jwt, origin);
            if (login.isEmpty()) {
                throw new InternalServerErrorException();
            }
            Optional<User> user = dao.get(login);
            user.ifPresent(User::disconnect);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (NullPointerException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // Login n'existe pas : 401
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
    @CrossOrigin(origins = {"http://localhost", "https://192.168.75.13", "http://192.168.75.13"})
    @Operation(summary = "S'authentifier avec le token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Déconnexion reussi.",
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
            if (dao.get(login).get().isConnected()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // L'utilisateur n'est pas connecté
        } catch (NullPointerException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // Login n'existe pas : 401
        } catch (JWTVerificationException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Le token est invalide : 400
        }
    }
}