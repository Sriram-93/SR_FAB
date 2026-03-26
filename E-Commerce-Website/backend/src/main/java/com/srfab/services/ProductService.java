package com.srfab.services;

import com.srfab.dto.CatalogCategoryDto;
import com.srfab.dto.ProductListItemDto;
import com.srfab.entities.Category;
import com.srfab.entities.Product;
import com.srfab.entities.ProductVariant;
import com.srfab.repositories.CategoryRepository;
import com.srfab.repositories.ProductRepository;
import com.srfab.repositories.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository variantRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Page<ProductListItemDto> getProductsPage(Integer categoryId, String search, String sortBy, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(1, Math.min(size, 60));
        Sort sort = Objects.requireNonNull(resolveSort(sortBy), "sort must not be null");
        Pageable pageable = PageRequest.of(safePage, safeSize, sort);

        Page<Product> productPage;
        if (search != null && !search.isBlank()) {
            productPage = productRepository.findByProductNameContainingIgnoreCase(search.trim(), pageable);
        } else if (categoryId != null) {
            productPage = productRepository.findByCategory_CategoryId(categoryId, pageable);
        } else {
            productPage = productRepository.findAllBy(pageable);
        }

        return productPage.map(this::toListItemDto);
    }

    public List<ProductListItemDto> getTrendingProducts(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 24));
        Pageable pageable = PageRequest.of(0, safeLimit, Sort.by(Sort.Direction.DESC, "productDiscount")
                .and(Sort.by(Sort.Direction.DESC, "productId")));

        Page<Product> page = productRepository.findByProductDiscountGreaterThan(0, pageable);

        if (!page.hasContent()) {
            page = productRepository.findAllBy(PageRequest.of(0, safeLimit, Sort.by(Sort.Direction.DESC, "productId")));
        }

        return page.stream().map(this::toListItemDto).collect(Collectors.toList());
    }

    public List<ProductListItemDto> getRelatedProducts(int productId, int categoryId, int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 24));
        Pageable pageable = PageRequest.of(0, safeLimit, Sort.by(Sort.Direction.DESC, "productId"));
        Page<Product> page = productRepository.findByCategory_CategoryIdAndProductIdNot(categoryId, productId, pageable);
        return page.stream().map(this::toListItemDto).collect(Collectors.toList());
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
        product.setApparelType(productDetails.getApparelType());
        product.setFitType(productDetails.getFitType());

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

    private ProductListItemDto toListItemDto(Product product) {
        CatalogCategoryDto categoryDto = null;
        if (product.getCategory() != null) {
            categoryDto = new CatalogCategoryDto(
                    product.getCategory().getCategoryId(),
                    product.getCategory().getCategoryName()
            );
        }

        List<String> colors = product.getVariants().stream()
                .map(ProductVariant::getColor)
                .filter(color -> color != null && !color.isBlank())
                .map(color -> color.toLowerCase(Locale.ROOT))
                .distinct()
                .collect(Collectors.toList());

        return new ProductListItemDto(
                product.getProductId(),
                product.getProductName(),
                product.getProductDescription(),
                product.getProductPrice(),
                product.getProductDiscount(),
                product.getProductPriceAfterDiscount(),
                product.getProductImages(),
                product.getBrand(),
                categoryDto,
                colors
        );
    }

    private Sort resolveSort(String sortBy) {
        if (sortBy == null || sortBy.isBlank() || "featured".equalsIgnoreCase(sortBy)) {
            return Sort.by(Sort.Direction.DESC, "productId");
        }

        if ("discount".equalsIgnoreCase(sortBy)) {
            return Sort.by(Sort.Direction.DESC, "productDiscount")
                    .and(Sort.by(Sort.Direction.DESC, "productId"));
        }

        return Sort.by(Sort.Direction.DESC, "productId");
    }
}
