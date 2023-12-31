package com.users.mif13.controller;

import com.users.mif13.DAO.UserDAO;
import com.users.mif13.model.Password;
import com.users.mif13.model.User;
import com.users.mif13.model.UserAPI;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.ws.rs.QueryParam;
import java.util.Optional;
import java.util.Set;

@EnableWebMvc
@CrossOrigin
@RestController
@RequestMapping(value = "/users")
public class UsersREST implements WebMvcConfigurer {

    public static final String MEDIA_TYPE_JSON = "application/json";

    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer.defaultContentType(MediaType.valueOf(MEDIA_TYPE_JSON));
    }

    @Autowired
    UserDAO userDAO;

    @GetMapping(value = "/list", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @Operation(summary = "Récupérer la liste des utilisateurs")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "La liste des utilisateurs",
                    content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = UserDAO.class)),
                            @Content(mediaType = "application/xml", schema = @Schema(implementation = UserDAO.class)),
                            @Content(mediaType = "text/html", schema = @Schema(implementation = UserDAO.class))
                    })})
    public ResponseEntity<Set<String>> getAll() {
        return new ResponseEntity<>(userDAO.getAll(), HttpStatus.OK);
    }

    @GetMapping(value = "/list", produces = MediaType.TEXT_HTML_VALUE)
    @Hidden
    public ModelAndView getAllHTML(Model model) {
        model.addAttribute("users", userDAO.getAll());
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("userList");

        return modelAndView;
    }

    @GetMapping(value = "/getOne", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @CrossOrigin(origins = {"http://localhost", "https://192.168.75.13", "http://192.168.75.13"})
    @Operation(summary = "Récupérer un utilisateur")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "L'utilisateur correspondant au login.",
                    content = {
                        @Content(mediaType = "application/json", schema = @Schema(implementation = User.class)),
                        @Content(mediaType = "application/xml", schema = @Schema(implementation = User.class)),
                        @Content(mediaType = "text/html", schema = @Schema(implementation = User.class))
                    }),
            @ApiResponse(responseCode = "400", description = "Le login de l'utilisateur n'existe pas.",
                    content = @Content)})
    public ResponseEntity<User> getOne( @Parameter(description = "Le login de l'utilisateur recherché") @QueryParam("login") String login) {
        Optional<User> user = userDAO.get(login);
        if (user.isPresent()) {
            return new ResponseEntity<>(user.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // L'utilsateur demandé n'existe pas
    }

    @GetMapping(value = "/getOne", produces = MediaType.TEXT_HTML_VALUE)
    @CrossOrigin(origins = {"http://localhost", "https://192.168.75.13", "http://192.168.75.13"})
    @Hidden
    public ModelAndView getOneHTML(@QueryParam("login") String login, Model model) throws ResponseStatusException {
        Optional<User> user = userDAO.get(login);
        if (user.isPresent()) {
            model.addAttribute("user", user.get());
            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("user");

            return modelAndView;
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'utilisateur demandé n'existe pas");
    }

    @PostMapping(value = "/", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @Operation(summary = "Crée un utilisateur")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Utilisateur crée",
                    content = @Content),
            @ApiResponse(responseCode = "400", description = "L'utilisateur n'a pas pu être crée car le login est déjà pris",
                    content = @Content)})
    public ResponseEntity<Void> createUrlEncoded(
            @Parameter(description = "Le login de l'utilisateur que l'on veut créer") @io.swagger.v3.oas.annotations.parameters.RequestBody  String login,
            @Parameter(description = "Le mot de passe de l'utilisateur que l'on veut créer") @io.swagger.v3.oas.annotations.parameters.RequestBody String password) {
        if (userDAO.get(login).isEmpty()) {
            userDAO.save(new User(login, password));
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }


    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createJson(@RequestBody UserAPI user) {
        if (userDAO.get(user.login).isEmpty()) {
            userDAO.save(new User(user.login, user.password));
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @Operation(summary = "Met à jour le mot de passe d'un utilisateur")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Mot de passe modifié",
                    content = @Content),
            @ApiResponse(responseCode = "400", description = "Le login de l'utilisateur n'existe pas",
                    content = @Content)})
    @PutMapping(value = "/{login}", consumes = {"multipart/form-data"})
    public ResponseEntity<Void> update( @Parameter(description = "Le nouveau mot de passe") @io.swagger.v3.oas.annotations.parameters.RequestBody String password,
                                        @Parameter(description = "Le login de l'utilisateur où le mot de passe doit être modifié") @PathVariable String login)
    {
        try {
            userDAO.update(new User(login, password));
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    @PutMapping(value = "/{login}", consumes = {"application/json"})
    public ResponseEntity<Void> updateJSON(@RequestBody Password password, @PathVariable String login) {
        try {
            userDAO.update(new User(login, password.password));
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{login}")
    @Operation(summary = "Supprime un utilisateur")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Utilisateur supprimé.",
                    content = @Content),
            @ApiResponse(responseCode = "400", description = "Le login de l'utilisateur n'existe pas.",
                    content = @Content)})
    public ResponseEntity<Void> delete(@Parameter(description = "Le login de l'utilisateur à supprimer.")
                                       @PathVariable String login) {
        try {
            userDAO.delete(login);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }
}
