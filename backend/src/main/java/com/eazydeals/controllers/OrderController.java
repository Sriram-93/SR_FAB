package com.eazydeals.controllers;

import com.eazydeals.dto.OrderRequest;
import com.eazydeals.entities.Order;
import com.eazydeals.entities.User;
import com.eazydeals.repositories.UserRepository;
import com.eazydeals.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest request, Authentication authentication) {
        try {
            User currentUser = userRepository.findByUserEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

            boolean isAdmin = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .anyMatch("ROLE_ADMIN"::equals);

            int requestedUserId = request.getUserId();
            int effectiveUserId = isAdmin && requestedUserId != 0
                    ? requestedUserId
                    : currentUser.getUserId();

            Order order = orderService.placeOrder(
                effectiveUserId,
                request.getPaymentType(), 
                request.getFrom(), 
                request.getProductId(),
                request.getVariantId()
            );
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable int userId, Authentication authentication) {
        User currentUser = userRepository.findByUserEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);

        int effectiveUserId = isAdmin ? userId : currentUser.getUserId();

        return ResponseEntity.ok(orderService.getUserOrders(effectiveUserId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    
    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable int orderId, @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
