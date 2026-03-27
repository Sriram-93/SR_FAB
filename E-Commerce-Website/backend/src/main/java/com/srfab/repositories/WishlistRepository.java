package com.srfab.repositories;

import com.srfab.entities.Wishlist;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    
    @EntityGraph(attributePaths = {"user", "product"})
    List<Wishlist> findByUser_UserId(int userId);
    
    @EntityGraph(attributePaths = {"user", "product"})
    java.util.Optional<Wishlist> findByUserAndProduct(com.srfab.entities.User user, com.srfab.entities.Product product);
}
