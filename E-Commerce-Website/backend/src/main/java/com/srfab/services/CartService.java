package com.srfab.services;

import com.srfab.entities.Cart;
import com.srfab.entities.Product;
import com.srfab.entities.ProductVariant;
import com.srfab.entities.User;
import com.srfab.repositories.CartRepository;
import com.srfab.repositories.ProductRepository;
import com.srfab.repositories.ProductVariantRepository;
import com.srfab.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;

    public List<Cart> getCartItems(int userId) {
        return cartRepository.findByUser_UserId(userId);
    }

    public Cart addToCart(int userId, int productId, int variantId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        // Check if same user + same variant exists in cart
        Optional<Cart> existingCart = cartRepository.findByUserAndVariant(user, variant);

        if (existingCart.isPresent()) {
            Cart cart = existingCart.get();
            cart.setQuantity(cart.getQuantity() + quantity);
            return cartRepository.save(cart);
        } else {
            Cart cart = new Cart();
            cart.setUser(user);
            cart.setProduct(product);
            cart.setVariant(variant);
            cart.setQuantity(quantity);
            return cartRepository.save(cart);
        }
    }

    public Cart updateQuantity(int cartId, int quantity) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cartRepository.delete(cart);
            return null;
        } else {
            cart.setQuantity(quantity);
            return cartRepository.save(cart);
        }
    }

    public void removeFromCart(int cartId) {
        cartRepository.deleteById(cartId);
    }

    public Cart getCartById(int cartId) {
        return cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
    }

    @Transactional
    public void clearCart(int userId) {
        cartRepository.deleteByUser_UserId(userId);
    }
}
