package com.srfab.controllers;

import com.srfab.dto.ProductListItemDto;
import com.srfab.services.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getWishlist(@PathVariable int userId) {
        try {
            List<ProductListItemDto> items = wishlistService.getWishlist(userId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }

    @PostMapping("/toggle")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> toggleWishlist(@RequestBody Map<String, Integer> request) {
        try {
            Integer userId = request.get("userId");
            Integer productId = request.get("productId");
            
            if (userId == null || productId == null) {
                return ResponseEntity.badRequest().body(errorMap("userId and productId are required"));
            }
            
            boolean added = wishlistService.toggleWishlist(userId, productId);
            Map<String, Object> response = new HashMap<>();
            response.put("added", added);
            response.put("message", added ? "Added to wishlist" : "Removed from wishlist");
            return ResponseEntity.ok(response);
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
