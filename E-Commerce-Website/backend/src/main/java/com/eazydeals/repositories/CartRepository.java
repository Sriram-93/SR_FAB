package com.eazydeals.repositories;

import com.eazydeals.entities.Cart;
import com.eazydeals.entities.ProductVariant;
import com.eazydeals.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    List<Cart> findByUser_UserId(int userId);
    Optional<Cart> findByUserAndVariant(User user, ProductVariant variant);
    void deleteByUser_UserId(int userId);
}
