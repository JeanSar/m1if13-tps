package com.users.mif13.DAO;

import com.users.mif13.model.User;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class UserDAO implements Dao<User> {
    private Map<String, User> users = new HashMap<>();
    //private List<User> users = new ArrayList<User>();

    public UserDAO() {
        users.put("John", new User("John", "john@domain.com"));
        users.put("Susan", new User("Susan", "susan@domain.com"));
    }

    @Override
    public Optional<User> get(String id) {
        return Optional.ofNullable(users.get(id));
    }

    @Override
    public Set<String> getAll() {
        Set<String> set = new HashSet<>();
        for(var user : users.entrySet()) {
            set.add(user.getKey());
        }
        return set;
    }

    @Override
    public void save(User user) throws IllegalArgumentException{
        if(this.get(user.getLogin()).isPresent()) {
            throw new IllegalArgumentException("Cet utilisateur existe déjà");
        } else {
            users.put(user.getLogin(), user);
        }
    }

    // update only the password in the collections
    @Override
    public void update(User user) throws IllegalArgumentException {
        if(this.get(user.getLogin()).isEmpty()) {
            throw new IllegalArgumentException("Cet utilisateur n'existe pas");
        } else {
            users.replace(user.getLogin(), user);
        }
    }

    @Override
    public void delete(User user) throws IllegalArgumentException {
        if(this.get(user.getLogin()).isEmpty()) {
            throw new IllegalArgumentException("Cet utilisateur n'existe pas");
        } else {
            users.remove(user.getLogin());
        }
    }
}
