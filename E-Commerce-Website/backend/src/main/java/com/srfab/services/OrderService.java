package com.srfab.services;

import com.srfab.entities.*;
import com.srfab.repositories.*;
import com.srfab.utils.OrderIdGenerator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderedProductRepository orderedProductRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartService cartService;
    private final ProductService productService;
    private final CouponRepository couponRepository;
    private final EmailService emailService;

    @Value("${app.stock.alert-threshold:5}")
    private int stockAlertThreshold;

    @Transactional
    public Order placeOrder(int userId, String paymentType, String from,
                            Integer singleProductId, Integer singleVariantId,
                            String couponCode, String shippingAddress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String orderId = OrderIdGenerator.getOrderId();
        Order order = new Order();
        order.setOrderId(orderId);
        order.setStatus("Order Placed");
        order.setPaymentType(paymentType);
        order.setUser(user);
        order.setDate(Timestamp.from(Instant.now()));
        order.setShippingAddress(shippingAddress);

        order = orderRepository.save(order);

        double subtotal = 0;

        if ("cart".equalsIgnoreCase(from)) {
            List<Cart> cartItems = cartRepository.findByUser_UserId(userId);
            if (cartItems.isEmpty()) {
                throw new RuntimeException("Cart is empty");
            }
            for (Cart item : cartItems) {
                processOrderedProduct(order, item.getProduct(), item.getVariant(), item.getQuantity());
                double price = parsePrice(item.getProduct().getProductPriceAfterDiscount());
                subtotal += price * item.getQuantity();
            }
            cartService.clearCart(userId);

        } else if ("buy".equalsIgnoreCase(from)) {
            if (singleProductId == null || singleVariantId == null) {
                throw new IllegalArgumentException("Product and variant must be provided for 'buy' orders");
            }
            Product product = productRepository.findById(singleProductId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            ProductVariant variant = productService.getVariantById(singleVariantId);
            processOrderedProduct(order, product, variant, 1);
            subtotal = parsePrice(product.getProductPriceAfterDiscount());
        } else {
            throw new IllegalArgumentException("Invalid order source: " + from);
        }

        // ── Discount Logic ──────────────────────────────
        double discount = 0;

        // First-order discount: 10% off
        long previousOrders = orderRepository.countByUser_UserId(userId) - 1; // exclude current
        if (previousOrders == 0) {
            discount = subtotal * 0.10;
            order.setCouponCode("FIRST_ORDER_10");
        }

        // Coupon discount (overrides first-order if higher)
        if (couponCode != null && !couponCode.isEmpty()) {
            Coupon coupon = couponRepository.findByCodeAndActiveTrue(couponCode).orElse(null);
            if (coupon != null) {
                Timestamp now = Timestamp.from(Instant.now());
                boolean valid = (coupon.getValidFrom() == null || !now.before(coupon.getValidFrom()))
                    && (coupon.getValidUntil() == null || !now.after(coupon.getValidUntil()))
                    && subtotal >= coupon.getMinOrderAmount();

                if (valid) {
                    double couponDiscount = subtotal * (coupon.getDiscountPercent() / 100.0);
                    if (coupon.getMaxDiscount() > 0 && couponDiscount > coupon.getMaxDiscount()) {
                        couponDiscount = coupon.getMaxDiscount();
                    }
                    if (couponDiscount > discount) {
                        discount = couponDiscount;
                        order.setCouponCode(couponCode);
                    }
                }
            }
        }

        order.setDiscountAmount(discount);
        order.setTotalAmount(subtotal - discount);
        order = orderRepository.save(order);

        // ── Send Emails (async) ─────────────────────────
        emailService.sendOrderConfirmation(order);
        emailService.sendPaymentConfirmation(order);

        return order;
    }

    private void processOrderedProduct(Order order, Product product, ProductVariant variant, int quantity) {
        productService.decreaseStock(variant.getVariantId(), quantity);

        // Check low stock alert
        ProductVariant updatedVariant = productService.getVariantById(variant.getVariantId());
        if (updatedVariant.getStock() <= stockAlertThreshold && updatedVariant.getStock() >= 0) {
            emailService.sendLowStockAlert(updatedVariant, product.getProductName());
        }

        OrderedProduct orderedProduct = new OrderedProduct();
        orderedProduct.setName(product.getProductName());
        orderedProduct.setQuantity(quantity);
        orderedProduct.setPrice(String.valueOf(product.getProductPriceAfterDiscount()));
        orderedProduct.setImage(product.getProductImages());
        orderedProduct.setSize(variant.getSize());
        orderedProduct.setColor(variant.getColor());
        orderedProduct.setOrder(order);

        orderedProductRepository.save(orderedProduct);
    }

    public List<Order> getUserOrders(int userId) {
        return orderRepository.findByUser_UserId(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(int orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        Order savedOrder = orderRepository.save(order);

        // Send status update email (async)
        emailService.sendOrderStatusUpdate(savedOrder);

        return savedOrder;
    }

    private double parsePrice(Object priceObj) {
        if (priceObj == null) return 0;
        try {
            return Double.parseDouble(String.valueOf(priceObj));
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
