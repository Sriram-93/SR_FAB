package com.srfab.services;

import com.srfab.dto.ProductListItemDto;
import com.srfab.entities.Product;
import com.srfab.entities.User;
import com.srfab.entities.Wishlist;
import com.srfab.repositories.ProductRepository;
import com.srfab.repositories.UserRepository;
import com.srfab.repositories.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ProductListItemDto> getWishlist(int userId) {
        return wishlistRepository.findByUser_UserId(userId).stream()
                .map(wishlist -> ProductListItemDto.fromEntity(wishlist.getProduct()))
                .toList();
    }

    @Transactional
    public boolean toggleWishlist(int userId, int productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<Wishlist> existing = wishlistRepository.findByUserAndProduct(user, product);

        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return false; // Removed
        } else {
            Wishlist wishlist = new Wishlist();
            wishlist.setUser(user);
            wishlist.setProduct(product);
            wishlistRepository.save(wishlist);
            return true; // Added
        }
    }

    @Transactional(readOnly = true)
    public boolean isInWishlist(int userId, int productId) {
        User user = userRepository.findById(userId).orElse(null);
        Product product = productRepository.findById(productId).orElse(null);
        if (user == null || product == null) return false;
        return wishlistRepository.findByUserAndProduct(user, product).isPresent();
    }
}
