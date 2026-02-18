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
            // Auto-detect: try admin first, then user
            String token;
            String role;
            try {
                token = authService.loginAdmin(request.getEmail(), request.getPassword());
                role = "ROLE_ADMIN";
            } catch (Exception e) {
                // Not an admin, try user login
                token = authService.loginUser(request.getEmail(), request.getPassword());
                role = "ROLE_USER";
            }
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", role);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User registeredUser = authService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
