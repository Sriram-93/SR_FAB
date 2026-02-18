package com.eazydeals.services;

import com.eazydeals.entities.User;
import com.eazydeals.entities.Admin;
import com.eazydeals.repositories.AdminRepository;
import com.eazydeals.repositories.UserRepository;
import com.eazydeals.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public String loginUser(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        User user = userRepository.findByUserEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return jwtUtil.generateToken(user);
    }
    
    public String loginAdmin(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        // If authentication passed, we know logic was correct, but we need the object to generate token with role
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return jwtUtil.generateToken(admin.get().getEmail(), "ROLE_ADMIN");
        }
        throw new UsernameNotFoundException("Admin not found");
    }

    public User registerUser(User user) {
        // Validate if email exists
        if (userRepository.findByUserEmail(user.getUserEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        user.setUserPassword(passwordEncoder.encode(user.getUserPassword()));
        return userRepository.save(user);
    }
}
