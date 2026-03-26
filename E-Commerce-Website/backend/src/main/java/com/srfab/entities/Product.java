package com.srfab.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pid")
    private int productId;

    @Column(name = "name", nullable = false, length = 250)
    private String productName;

    @Column(name = "description", length = 500)
    private String productDescription;

    @Column(name = "price", nullable = false, length = 20)
    private String productPrice;

    @Column(name = "discount")
    private int productDiscount;

    @Column(name = "image", length = 512)
    private String productImages;

    // ── Fashion-Specific Fields ──
    @Column(name = "brand", length = 100)
    private String brand;

    @Column(name = "fabric_type", length = 100)
    private String fabricType; // Cotton, Silk, Polyester Blend, etc.

    @Column(name = "apparel_type", length = 60)
    private String apparelType;

    @Column(name = "fit_type", length = 60)
    private String fitType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cid")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ProductVariant> variants = new ArrayList<>();

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Model3D model3D;

    // ── Computed Helpers ──
    public float getProductPriceAsFloat() {
        try {
            return Float.parseFloat(productPrice);
        } catch (NumberFormatException e) {
            return 0.0f;
        }
    }

    public int getProductPriceAfterDiscount() {
        float price = getProductPriceAsFloat();
        int discount = (int) ((this.productDiscount / 100.0) * price);
        return (int) (price - discount);
    }

    /** Total stock across all variants */
    public int getTotalStock() {
        return variants.stream().mapToInt(ProductVariant::getStock).sum();
    }
}
