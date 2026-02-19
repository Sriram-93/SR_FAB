package com.eazydeals.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "`order`")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    
    @Column(name = "orderid", length = 100)
    private String orderId;
    
    @Column(name = "status", length = 100)
    private String status;
    
    @Column(name = "paymentType", length = 100)
    private String paymentType;
    
    @Column(name = "date")
    private Timestamp date;

    @Column(name = "total_amount")
    private double totalAmount;

    @Column(name = "discount_amount")
    private double discountAmount;

    @Column(name = "coupon_code", length = 50)
    private String couponCode;

    @Column(name = "shipping_address", length = 500)
    private String shippingAddress;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    @JsonIgnoreProperties({"userPassword", "hibernateLazyInitializer", "handler"})
    private User user;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderedProduct> orderedProducts = new ArrayList<>();
}
