package com.eazydeals.services;

import com.eazydeals.entities.Category;
import com.eazydeals.entities.Product;
import com.eazydeals.entities.ProductVariant;
import com.eazydeals.repositories.CategoryRepository;
import com.eazydeals.repositories.ProductRepository;
import com.eazydeals.repositories.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository variantRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(int categoryId) {
        return productRepository.findByCategory_CategoryId(categoryId);
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.findByProductNameContainingIgnoreCase(keyword);
    }

    public Product getProductById(int id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product addProduct(Product product, int categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);

        // Link variants back to product
        if (product.getVariants() != null) {
            product.getVariants().forEach(v -> v.setProduct(product));
        }

        return productRepository.save(product);
    }

    public Product updateProduct(int id, Product productDetails, Integer categoryId) {
        Product product = getProductById(id);

        product.setProductName(productDetails.getProductName());
        product.setProductDescription(productDetails.getProductDescription());
        product.setProductPrice(productDetails.getProductPrice());
        product.setProductDiscount(productDetails.getProductDiscount());
        product.setBrand(productDetails.getBrand());
        product.setFabricType(productDetails.getFabricType());

        if (productDetails.getProductImages() != null) {
            product.setProductImages(productDetails.getProductImages());
        }

        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        // Update variants: clear and re-add
        if (productDetails.getVariants() != null) {
            product.getVariants().clear();
            productDetails.getVariants().forEach(v -> {
                v.setProduct(product);
                product.getVariants().add(v);
            });
        }

        return productRepository.save(product);
    }

    public void deleteProduct(int id) {
        productRepository.deleteById(id);
    }

    // ── Variant-level stock management ──

    public void decreaseStock(int variantId, int quantityToDecrease) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));
        if (variant.getStock() < quantityToDecrease) {
            throw new RuntimeException("Insufficient stock for variant: " + variant.getSku());
        }
        variant.setStock(variant.getStock() - quantityToDecrease);
        variantRepository.save(variant);
    }

    public ProductVariant getVariantById(int variantId) {
        return variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));
    }

    public List<ProductVariant> getVariantsByProduct(int productId) {
        return variantRepository.findByProduct_ProductId(productId);
    }

    public void updateVariantStock(int variantId, int newStock) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));
        variant.setStock(newStock);
        variantRepository.save(variant);
    }
}
