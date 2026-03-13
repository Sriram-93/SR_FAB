package com.srfab.config;

import com.srfab.entities.Admin;
import com.srfab.entities.User;
import com.srfab.repositories.AdminRepository;
import com.srfab.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // Only seed data if no admin exists (first-time setup)
        if (adminRepository.count() == 0) {
            log.info("=== No admin found. Seeding default credentials ===");

            Admin admin = new Admin();
            admin.setName("Admin");
            admin.setEmail("admin@srfab.com");
            admin.setPhone("9999999999");
            admin.setPassword(passwordEncoder.encode("admin123"));
            adminRepository.save(admin);
            log.info("✅ ADMIN created -> Email: admin@srfab.com | Password: admin123");
        } else {
            log.info("Admin already exists. Skipping admin seed.");
        }

        if (userRepository.count() == 0) {
            log.info("=== No users found. Seeding default user ===");

            User user = new User();
            user.setUserName("User");
            user.setUserEmail("user@srfab.com");
            user.setUserPhone("8888888888");
            user.setUserGender("Male");
            user.setUserPassword(passwordEncoder.encode("user123"));
            user.setDateTime(Timestamp.from(Instant.now()));
            user.setUserAddress("123, Main Street");
            user.setUserCity("Chennai");
            user.setUserPincode("600001");
            user.setUserState("Tamil Nadu");
            userRepository.save(user);
            log.info("✅ USER created  -> Email: user@srfab.com  | Password: user123");
        } else {
            log.info("Users already exist. Skipping user seed.");
        }

        log.info("=== Data initialization complete ===");
    }
}
