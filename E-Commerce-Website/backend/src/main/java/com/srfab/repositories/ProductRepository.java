package com.srfab.repositories;

import com.srfab.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @EntityGraph(attributePaths = {"category"})
    Page<Product> findAllBy(Pageable pageable);

    @EntityGraph(attributePaths = {"category"})
    List<Product> findByCategory_CategoryId(int categoryId);

    @EntityGraph(attributePaths = {"category"})
    Page<Product> findByCategory_CategoryId(int categoryId, Pageable pageable);

    @EntityGraph(attributePaths = {"category"})
    Page<Product> findByCategory_CategoryIdAndProductIdNot(int categoryId, int productId, Pageable pageable);

    @EntityGraph(attributePaths = {"category"})
    List<Product> findByProductNameContainingIgnoreCase(String keyword);

    @EntityGraph(attributePaths = {"category"})
    Page<Product> findByProductNameContainingIgnoreCase(String keyword, Pageable pageable);

    @EntityGraph(attributePaths = {"category"})
    @Query("SELECT p FROM Product p WHERE " +
           "(:categoryId IS NULL OR p.category.categoryId = :categoryId) AND " +
           "(:search IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> findWithFilters(Integer categoryId, String search, Pageable pageable);

        @EntityGraph(attributePaths = {"category"})
        @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.productName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%'))")
        Page<Product> findBySearch(@Param("search") String search, Pageable pageable);

        @EntityGraph(attributePaths = {"category"})
        @Query("SELECT p FROM Product p WHERE p.category.categoryId = :categoryId AND (" +
            "LOWER(p.productName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%')))")
        Page<Product> findByCategoryAndSearch(@Param("categoryId") Integer categoryId,
                            @Param("search") String search,
                            Pageable pageable);

    @EntityGraph(attributePaths = {"category"})
    Page<Product> findByProductDiscountGreaterThan(int discount, Pageable pageable);

    @EntityGraph(attributePaths = {"category"})
    @Query("SELECT p FROM Product p WHERE p.productDiscount > 0")
    List<Product> findDiscountedProducts();

    @EntityGraph(attributePaths = {"category", "variants", "model3D"})
    Optional<Product> findByProductId(int productId);

    @EntityGraph(attributePaths = {"category", "variants"})
    @Query("SELECT p FROM Product p")
    List<Product> findAllForAdmin();

    @EntityGraph(attributePaths = {"category"})
    @Query("SELECT p FROM Product p")
    List<Product> findAllOptimized();
}
