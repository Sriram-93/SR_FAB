package com.srfab.repositories;

import com.srfab.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    Page<Product> findAllBy(Pageable pageable);

    List<Product> findByCategory_CategoryId(int categoryId);

    Page<Product> findByCategory_CategoryId(int categoryId, Pageable pageable);

    Page<Product> findByCategory_CategoryIdAndProductIdNot(int categoryId, int productId, Pageable pageable);

    List<Product> findByProductNameContainingIgnoreCase(String keyword);

    Page<Product> findByProductNameContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Product> findByProductDiscountGreaterThan(int discount, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.productDiscount > 0")
    List<Product> findDiscountedProducts();
}
