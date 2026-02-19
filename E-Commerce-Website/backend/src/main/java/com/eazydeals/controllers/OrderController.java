package com.eazydeals.controllers;

import com.eazydeals.dto.OrderRequest;
import com.eazydeals.entities.Order;
import com.eazydeals.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request) {
        try {
            Order order = orderService.placeOrder(
                request.getUserId(),
                request.getPaymentType(),
                request.getFrom(),
                request.getProductId(),
                request.getVariantId(),
                request.getCouponCode(),
                request.getShippingAddress()
            );
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order placed successfully");
            response.put("orderId", order.getOrderId());
            response.put("status", order.getStatus());
            response.put("totalAmount", order.getTotalAmount());
            response.put("discountAmount", order.getDiscountAmount());
            if (order.getCouponCode() != null) {
                response.put("couponApplied", order.getCouponCode());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserOrders(@PathVariable int userId) {
        try {
            List<Order> orders = orderService.getUserOrders(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllOrders() {
        try {
            List<Order> orders = orderService.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable int orderId, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            Order order = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<?> getUserOrderCount(@PathVariable int userId) {
        try {
            long count = orderService.getUserOrders(userId).size();
            return ResponseEntity.ok(Map.of("count", count));
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
