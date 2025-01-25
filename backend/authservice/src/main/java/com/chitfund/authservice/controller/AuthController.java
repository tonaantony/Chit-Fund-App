package com.chitfund.authservice.controller;


import com.chitfund.authservice.dto.LoginRequest;
import com.chitfund.authservice.model.User;
import com.chitfund.authservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Register Endpoint
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody User user) {
        authService.register(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return response;
    }

    // Login Endpoint
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        String token = authService.login(loginRequest.getUserEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(token);
    }
}

