package com.srfab.services;

import com.srfab.entities.User;
import com.srfab.entities.Admin;
import com.srfab.repositories.AdminRepository;
import com.srfab.repositories.UserRepository;
import com.srfab.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

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
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return jwtUtil.generateToken(admin.get().getEmail(), "ROLE_ADMIN");
        }
        throw new UsernameNotFoundException("Admin not found");
    }

    public User registerUser(User user) {
        if (userRepository.findByUserEmail(user.getUserEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        if (user.getUserPhone() != null && userRepository.findByUserPhone(user.getUserPhone()).isPresent()) {
            throw new RuntimeException("Phone number already exists");
        }
        user.setUserPassword(passwordEncoder.encode(user.getUserPassword()));
        user.setDateTime(Timestamp.from(Instant.now()));
        User savedUser = userRepository.save(user);

        // Send welcome email (async — won't block registration)
        emailService.sendWelcomeEmail(savedUser);

        return savedUser;
    }
}
