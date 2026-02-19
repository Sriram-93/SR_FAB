package com.eazydeals.controllers;

import com.eazydeals.dto.LoginRequest;
import com.eazydeals.entities.User;
import com.eazydeals.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String token;
            String role;
            try {
                token = authService.loginAdmin(request.getEmail(), request.getPassword());
                role = "ROLE_ADMIN";
            } catch (Exception e) {
                token = authService.loginUser(request.getEmail(), request.getPassword());
                role = "ROLE_USER";
            }
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", role);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid credentials");
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User registeredUser = authService.registerUser(user);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration successful");
            response.put("userId", registeredUser.getUserId());
            response.put("email", registeredUser.getUserEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
