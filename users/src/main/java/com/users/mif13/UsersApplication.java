package com.users.mif13;

import com.users.mif13.DAO.UserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UsersApplication {

    @Autowired
    UserDAO userDAO;

    public static void main(String[] args) {
        SpringApplication.run(UsersApplication.class, args);
    }

}
