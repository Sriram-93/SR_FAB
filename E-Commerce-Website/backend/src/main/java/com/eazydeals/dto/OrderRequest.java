package com.eazydeals.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private int userId;
    private String paymentType;
    private String from; // "cart" or "buy"
    private Integer productId; // Optional, if from "buy"
    private Integer variantId; // Optional, if from "buy"
    private String couponCode; // Optional coupon
    private String shippingAddress; // Delivery address
}
