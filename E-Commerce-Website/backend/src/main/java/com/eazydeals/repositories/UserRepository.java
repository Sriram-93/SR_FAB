package com.eazydeals.repositories;

import com.eazydeals.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUserEmail(String userEmail);
    Optional<User> findByUserPhone(String userPhone);
    Optional<User> findByUserEmailAndUserPassword(String userEmail, String userPassword);
}
