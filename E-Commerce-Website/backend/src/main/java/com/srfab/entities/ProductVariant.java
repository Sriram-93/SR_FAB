package com.srfab.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_variant", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"pid", "size", "color"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variant_id")
    private int variantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pid", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Product product;

    @Column(name = "size", length = 20)
    private String size; // S, M, L, XL, XXL, 28, 30, etc.

    @Column(name = "color", length = 50)
    private String color;

    @Column(name = "stock", nullable = false)
    private int stock;

    @Column(name = "sku", length = 50, unique = true)
    private String sku; // e.g. "KURTA-BLU-XL"
}
