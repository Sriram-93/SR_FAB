package com.srfab.controllers;

import com.srfab.entities.User;
import com.srfab.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable int id) {
        try {
            User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable int id, @RequestBody Map<String, String> updates) {
        try {
            User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

            if (updates.containsKey("userName")) user.setUserName(updates.get("userName"));
            if (updates.containsKey("userPhone")) user.setUserPhone(updates.get("userPhone"));
            if (updates.containsKey("userGender")) user.setUserGender(updates.get("userGender"));
            if (updates.containsKey("userAddress")) user.setUserAddress(updates.get("userAddress"));
            if (updates.containsKey("userCity")) user.setUserCity(updates.get("userCity"));
            if (updates.containsKey("userPincode")) user.setUserPincode(updates.get("userPincode"));
            if (updates.containsKey("userState")) user.setUserState(updates.get("userState"));

            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("userId", user.getUserId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
