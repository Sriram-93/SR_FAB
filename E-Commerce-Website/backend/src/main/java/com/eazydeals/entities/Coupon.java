package com.eazydeals.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "coupon")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(name = "discount_percent")
    private double discountPercent;

    @Column(name = "min_order_amount")
    private double minOrderAmount;

    @Column(name = "max_discount")
    private double maxDiscount;

    @Column(name = "active")
    private boolean active = true;

    @Column(name = "valid_from")
    private Timestamp validFrom;

    @Column(name = "valid_until")
    private Timestamp validUntil;
}
