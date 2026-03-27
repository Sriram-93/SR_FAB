package com.srfab.controllers;

import com.srfab.entities.Coupon;
import com.srfab.repositories.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CouponController {

    private final CouponRepository couponRepository;

    // ─── Admin CRUD ──────────────────────────────────────

    @GetMapping("/api/admin/coupons")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllCoupons() {
        return ResponseEntity.ok(couponRepository.findAll());
    }

    @PostMapping("/api/admin/coupons")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCoupon(@RequestBody Coupon coupon) {
        try {
            if (couponRepository.findByCode(coupon.getCode()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Coupon code already exists"));
            }
            return ResponseEntity.ok(couponRepository.save(coupon));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/api/admin/coupons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCoupon(@PathVariable int id, @RequestBody Coupon updated) {
        try {
            Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
            coupon.setCode(updated.getCode());
            coupon.setDiscountPercent(updated.getDiscountPercent());
            coupon.setMinOrderAmount(updated.getMinOrderAmount());
            coupon.setMaxDiscount(updated.getMaxDiscount());
            coupon.setActive(updated.isActive());
            coupon.setValidFrom(updated.getValidFrom());
            coupon.setValidUntil(updated.getValidUntil());
            return ResponseEntity.ok(couponRepository.save(coupon));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/api/admin/coupons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCoupon(@PathVariable int id) {
        try {
            couponRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Coupon deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Public Validate ─────────────────────────────────

    @PostMapping("/api/coupons/validate")
    public ResponseEntity<?> validateCoupon(@RequestBody Map<String, Object> request) {
        try {
            String code = (String) request.get("code");
            double orderTotal = ((Number) request.get("orderTotal")).doubleValue();

            Coupon coupon = couponRepository.findByCodeAndActiveTrue(code)
                .orElseThrow(() -> new RuntimeException("Invalid or expired coupon code"));

            // Check validity dates
            Timestamp now = Timestamp.from(Instant.now());
            if (coupon.getValidFrom() != null && now.before(coupon.getValidFrom())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Coupon is not yet active"));
            }
            if (coupon.getValidUntil() != null && now.after(coupon.getValidUntil())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Coupon has expired"));
            }

            // Check min order
            if (orderTotal < coupon.getMinOrderAmount()) {
                return ResponseEntity.badRequest().body(Map.of("error",
                    "Minimum order amount ₹" + (int) coupon.getMinOrderAmount() + " required"));
            }

            // Calculate discount
            double discount = orderTotal * (coupon.getDiscountPercent() / 100.0);
            if (coupon.getMaxDiscount() > 0 && discount > coupon.getMaxDiscount()) {
                discount = coupon.getMaxDiscount();
            }

            return ResponseEntity.ok(Map.of(
                "valid", true,
                "code", coupon.getCode(),
                "discountPercent", coupon.getDiscountPercent(),
                "discountAmount", discount,
                "finalTotal", orderTotal - discount
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
