package com.users.mif13.controller;

import com.users.mif13.DAO.UserDAO;
import com.users.mif13.model.User;
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
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@EnableWebMvc
@RestController
@RequestMapping(value = "/users")
public class UsersREST implements WebMvcConfigurer {

    public static final String MEDIA_TYPE_JSON  = "application/json";

    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer.defaultContentType(MediaType.valueOf(MEDIA_TYPE_JSON));
    }

    @Autowired
    UserDAO userDAO;

    @GetMapping(value ="/list", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Set<String>> getAll() {
        return new ResponseEntity<>(userDAO.getAll(), HttpStatus.OK);
    }


    @GetMapping(value ="/list", produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getAllHTML(Model model) {
        model.addAttribute("users", userDAO.getAll());
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("userList");

        return modelAndView;
    }

    @GetMapping(value = "/getOne", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE} )
    public ResponseEntity<User> getOne(@QueryParam("login") String login) {
        Optional<User> user = userDAO.get(login);
        if(user.isPresent()) {
            return new ResponseEntity<>(user.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // L'utilsateur demandé n'existe pas
    }


    // TODO - Chercher ou demander comment faire pour renvoyer un code http avec la réponse de la page html
    @GetMapping(value ="/getOne", produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getOneHTML(@QueryParam("login") String login, Model model) throws ResponseStatusException {
        Optional<User> user = userDAO.get(login);
        if(user.isPresent()) {
            model.addAttribute("user", user.get());
            ModelAndView modelAndView = new ModelAndView();
            modelAndView.setViewName("user");

            return modelAndView;
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'utilsateur demandé n'existe pas");
    }

    @PostMapping(value = "/", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    ResponseEntity<Void> create(@RequestParam("login") String login, @RequestParam("password") String password) {
        if(userDAO.get(login).isEmpty()) {
            userDAO.save(new User(login, password));
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Void> create(@RequestBody User user) {
        if(userDAO.get(user.getLogin()).isEmpty()) {
            userDAO.save(user);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    // TODO - Accepter l'url encoded
    @PutMapping(value = "/{login}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public ResponseEntity<Void> update(@PathVariable String login, @RequestParam("password") String password) {
        try {
            userDAO.update(new User(login, password));
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    @PutMapping(value = "/{login}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> updateJSON(@PathVariable String login, @RequestBody Map<String, String> password) {
        try {
            userDAO.update(new User(login, password.get("password")));
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{login}")
    public ResponseEntity<Void> delete (@PathVariable String login) {
        try {
            userDAO.delete(login);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }
}
