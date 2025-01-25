package com.chitfund.authservice.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
public class AuthServiceTest {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testPasswordEncoderBean() {
        assertNotNull(passwordEncoder, "PasswordEncoder bean should not be null");
    }
}
