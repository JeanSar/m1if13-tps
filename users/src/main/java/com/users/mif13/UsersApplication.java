package com.users.mif13;

import com.users.mif13.DAO.UserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UsersApplication implements CommandLineRunner {

    @Autowired
    UserDAO userDAO;

    public static void main(String[] args) {
        SpringApplication.run(UsersApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println(userDAO.getAll().toArray()[0]);
    }
}
