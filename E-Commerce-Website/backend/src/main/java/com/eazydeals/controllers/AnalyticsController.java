package com.eazydeals.controllers;

import com.eazydeals.entities.Order;
import com.eazydeals.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<?> getAnalytics() {
        try {
            long totalProducts = productRepository.count();
            long totalOrders = orderRepository.count();
            long totalUsers = userRepository.count();
            long totalCategories = categoryRepository.count();

            // Calculate total revenue from orders
            List<Order> allOrders = orderRepository.findAll();
            double totalRevenue = allOrders.stream()
                .mapToDouble(o -> o.getTotalAmount() > 0 ? o.getTotalAmount() : 0)
                .sum();

            // Recent 5 orders (safe sort)
            List<Order> recentOrders = allOrders.stream()
                .filter(o -> o.getDate() != null)
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                .limit(5)
                .toList();

            Map<String, Object> analytics = new LinkedHashMap<>();
            analytics.put("totalProducts", totalProducts);
            analytics.put("totalOrders", totalOrders);
            analytics.put("totalUsers", totalUsers);
            analytics.put("totalCategories", totalCategories);
            analytics.put("totalRevenue", totalRevenue);
            analytics.put("recentOrders", recentOrders);

            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
