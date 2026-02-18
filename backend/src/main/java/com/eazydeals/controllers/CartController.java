package com.eazydeals.controllers;

import com.eazydeals.entities.Cart;
import com.eazydeals.entities.User;
import com.eazydeals.repositories.UserRepository;
import com.eazydeals.services.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Cart>> getCart(@PathVariable int userId, Authentication authentication) {
        User currentUser = userRepository.findByUserEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);

        int effectiveUserId = isAdmin ? userId : currentUser.getUserId();

        return ResponseEntity.ok(cartService.getCartItems(effectiveUserId));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody Map<String, Integer> request, Authentication authentication) {
        User currentUser = userRepository.findByUserEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);

        int requestedUserId = request.getOrDefault("userId", currentUser.getUserId());
        int productId = request.get("productId");
        int variantId = request.get("variantId");
        int quantity = request.getOrDefault("quantity", 1);

        int effectiveUserId = isAdmin ? requestedUserId : currentUser.getUserId();

        return ResponseEntity.ok(cartService.addToCart(effectiveUserId, productId, variantId, quantity));
    }

    @PutMapping("/{cartId}")
    public ResponseEntity<Cart> updateQuantity(@PathVariable int cartId, @RequestBody Map<String, Integer> request, Authentication authentication) {
        User currentUser = userRepository.findByUserEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);

        Cart cart = cartService.getCartById(cartId);
        if (!isAdmin && cart.getUser().getUserId() != currentUser.getUserId()) {
            return ResponseEntity.status(403).build();
        }

        int quantity = request.get("quantity");
        return ResponseEntity.ok(cartService.updateQuantity(cartId, quantity));
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable int cartId, Authentication authentication) {
        User currentUser = userRepository.findByUserEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);

        Cart cart = cartService.getCartById(cartId);
        if (!isAdmin && cart.getUser().getUserId() != currentUser.getUserId()) {
            return ResponseEntity.status(403).build();
        }

        cartService.removeFromCart(cartId);
        return ResponseEntity.ok().build();
    }
}
