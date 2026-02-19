package com.eazydeals.controllers;

import com.eazydeals.entities.Product;
import com.eazydeals.services.CloudinaryService;
import com.eazydeals.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        try {
            return ResponseEntity.ok(productService.getAllProducts());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable int id) {
        try {
            return ResponseEntity.ok(productService.getProductById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getProductsByCategory(@PathVariable int categoryId) {
        try {
            return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(@RequestParam String q) {
        try {
            return ResponseEntity.ok(productService.searchProducts(q));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addProduct(@RequestBody Product product, @RequestParam int categoryId) {
        try {
            return ResponseEntity.ok(productService.addProduct(product, categoryId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(@PathVariable int id, @RequestBody Product product, @RequestParam(required = false) Integer categoryId) {
        try {
            return ResponseEntity.ok(productService.updateProduct(id, product, categoryId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable int id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(Map.of("message", "Product deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }

    // ─── Variant Stock Update ────────────────────────────
    @PutMapping("/variants/{variantId}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateVariantStock(@PathVariable int variantId, @RequestBody Map<String, Integer> request) {
        try {
            int stock = request.get("stock");
            productService.updateVariantStock(variantId, stock);
            return ResponseEntity.ok(Map.of("message", "Stock updated", "variantId", variantId, "newStock", stock));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorMap(e.getMessage()));
        }
    }

    // ─── Cloudinary Image Upload ─────────────────────────
    @PostMapping("/upload-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String url = cloudinaryService.uploadImage(file, "products");
            return ResponseEntity.ok(Map.of("url", url));
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
