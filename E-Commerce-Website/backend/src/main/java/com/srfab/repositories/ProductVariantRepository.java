package com.srfab.repositories;

import com.srfab.entities.Product;
import com.srfab.entities.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {

    List<ProductVariant> findByProduct_ProductId(int productId);

    Optional<ProductVariant> findBySku(String sku);

    Optional<ProductVariant> findByProductAndSizeAndColor(Product product, String size, String color);
}
