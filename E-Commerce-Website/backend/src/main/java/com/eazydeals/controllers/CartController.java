package com.eazydeals.controllers;

import com.eazydeals.entities.Cart;
import com.eazydeals.services.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getCart(@PathVariable int userId) {
        try {
            List<Cart> items = cartService.getCartItems(userId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Integer> request) {
        try {
            int userId = request.get("userId");
            int productId = request.get("productId");
            int variantId = request.get("variantId");
            int quantity = request.getOrDefault("quantity", 1);
            Cart cart = cartService.addToCart(userId, productId, variantId, quantity);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }

    @PutMapping("/{cartId}")
    public ResponseEntity<?> updateQuantity(@PathVariable int cartId, @RequestBody Map<String, Integer> request) {
        try {
            int quantity = request.get("quantity");
            Cart updatedCart = cartService.updateQuantity(cartId, quantity);
            if (updatedCart == null) {
                return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
            }
            return ResponseEntity.ok(updatedCart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<?> removeFromCart(@PathVariable int cartId) {
        try {
            cartService.removeFromCart(cartId);
            return ResponseEntity.ok(Map.of("message", "Item removed"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }

    private Map<String, String> errorMap(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
