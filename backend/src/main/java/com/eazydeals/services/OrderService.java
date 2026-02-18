package com.eazydeals.services;

import com.eazydeals.entities.*;
import com.eazydeals.repositories.*;
import com.eazydeals.utils.OrderIdGenerator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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

    @Transactional
    public Order placeOrder(int userId, String paymentType, String from, Integer singleProductId, Integer singleVariantId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String orderId = OrderIdGenerator.getOrderId();
        Order order = new Order();
        order.setOrderId(orderId);
        order.setStatus("Order Placed");
        order.setPaymentType(paymentType);
        order.setUser(user);
        order.setDate(Timestamp.from(Instant.now()));

        order = orderRepository.save(order);

        if ("cart".equalsIgnoreCase(from)) {
            List<Cart> cartItems = cartRepository.findByUser_UserId(userId);
            if (cartItems.isEmpty()) {
                throw new RuntimeException("Cart is empty");
            }

            for (Cart item : cartItems) {
                processOrderedProduct(order, item.getProduct(), item.getVariant(), item.getQuantity());
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
        } else {
            throw new IllegalArgumentException("Invalid order source: " + from);
        }

        return order;
    }

    private void processOrderedProduct(Order order, Product product, ProductVariant variant, int quantity) {
        // Decrease stock on the specific variant
        productService.decreaseStock(variant.getVariantId(), quantity);

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
        return orderRepository.save(order);
    }
}
