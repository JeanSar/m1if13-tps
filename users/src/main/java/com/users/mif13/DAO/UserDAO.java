package com.users.mif13.DAO;

import com.users.mif13.model.User;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class UserDAO implements Dao<User> {
    private List<User> users = new ArrayList<User>();

    public UserDAO() {
        users.add(new User("John", "john@domain.com"));
        users.add(new User("Susan", "susan@domain.com"));
    }

    @Override
    public Optional<User> get(String id) {
        return Optional.empty();
    }

    @Override
    public Set<String> getAll() {
        Set<String> set = new HashSet<String>();
        for(User user: this.users) {
            set.add(user.getLogin());
        }

        return set;
    }

    @Override
    public void save(User user) {

    }

    @Override
    public void update(User user, String[] params) {

    }

    @Override
    public void delete(User user) {

    }
}
