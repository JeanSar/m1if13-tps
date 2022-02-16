package com.users.mif13;

import com.users.mif13.DAO.UserDAO;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springdoc.core.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class UsersApplication extends SpringBootServletInitializer {

    @Autowired
    UserDAO userDAO;

    public static void main(String[] args) {
        SpringApplication.run(UsersApplication.class, args);
    }


    @Bean
    public OpenAPI customOpenAPI(@Value("0.1") String appVersion) {
        return new OpenAPI()
                .info(new Info().title("Users API").version(appVersion)
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }

}
