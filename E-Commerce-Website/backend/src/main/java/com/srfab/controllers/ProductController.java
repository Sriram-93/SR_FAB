package com.srfab.controllers;

import com.srfab.dto.PaginatedResponseDto;
import com.srfab.dto.ProductListItemDto;
import com.srfab.entities.Product;
import com.srfab.services.CloudinaryService;
import com.srfab.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    public ResponseEntity<List<ProductListItemDto>> getAllProducts() {
        // Return paginated results instead of all products to avoid timeout
        // Frontend should use /paged endpoint for better performance
        var page = productService.getProductsPage(null, null, "featured", 0, 100);
        return ResponseEntity.ok(page.stream().map(dto -> dto).toList());
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Product>> getAllProductsForAdmin() {
        return ResponseEntity.ok(productService.getAllProductsForAdmin());
    }

    @GetMapping("/paged")
    public ResponseEntity<PaginatedResponseDto<ProductListItemDto>> getProductsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "featured") String sortBy
    ) {
        Page<ProductListItemDto> result = productService.getProductsPage(categoryId, search, sortBy, page, size);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(60, TimeUnit.SECONDS).cachePublic())
                .body(PaginatedResponseDto.from(result));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<ProductListItemDto>> getTrendingProducts(@RequestParam(defaultValue = "8") int limit) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(120, TimeUnit.SECONDS).cachePublic())
                .body(productService.getTrendingProducts(limit));
    }

    @GetMapping("/related")
    public ResponseEntity<List<ProductListItemDto>> getRelatedProducts(
            @RequestParam int productId,
            @RequestParam int categoryId,
            @RequestParam(defaultValue = "8") int limit
    ) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(60, TimeUnit.SECONDS).cachePublic())
                .body(productService.getRelatedProducts(productId, categoryId, limit));
    }

    // ─── Migrate Product Catalog to Cloudinary ──────────
    @GetMapping("/admin/migrate-catalog")
    public ResponseEntity<Map<String, Object>> migrateCatalog() {
        int migratedCount = productService.migrateUnsplashImagesToCloudinary(cloudinaryService);
        return ResponseEntity.ok(Map.of(
            "message", "Migration complete",
            "count", migratedCount,
            "status", "SUCCESS"
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable int categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String q) {
        return ResponseEntity.ok(productService.searchProducts(q));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> addProduct(@RequestBody Product product, @RequestParam int categoryId) {
        return ResponseEntity.ok(productService.addProduct(product, categoryId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable int id, @RequestBody Product product, @RequestParam(required = false) Integer categoryId) {
        return ResponseEntity.ok(productService.updateProduct(id, product, categoryId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable int id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted"));
    }

    // ─── Variant Stock Update ────────────────────────────
    @PutMapping("/variants/{variantId}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateVariantStock(@PathVariable int variantId, @RequestBody Map<String, Integer> request) {
        int stock = request.get("stock");
        productService.updateVariantStock(variantId, stock);
        return ResponseEntity.ok(Map.of("message", "Stock updated", "variantId", variantId, "newStock", stock));
    }

}
