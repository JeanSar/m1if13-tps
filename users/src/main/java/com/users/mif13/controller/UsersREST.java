package com.users.mif13.controller;

import com.users.mif13.DAO.UserDAO;
import com.users.mif13.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.QueryParam;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController()
@RequestMapping("/users")
public class UsersREST {

    @Autowired
    UserDAO userDAO;

    @GetMapping("/list")
    public ResponseEntity<Set<String>> getAll() {
        return new ResponseEntity<>(userDAO.getAll(), HttpStatus.OK);
    }

    @GetMapping("/getOne")
    public ResponseEntity<User> getOne(@QueryParam("login") String login) {
        Optional<User> user = userDAO.get(login);
        if(user.isPresent()) {
            return new ResponseEntity<>(user.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // L'utilsateur demandé n'existe pas
    }

    @PutMapping("/update/{login}")
    public ResponseEntity<Void> update(@RequestParam("password") String password, @PathVariable String login) {
        userDAO.update(new User(login, password));
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
