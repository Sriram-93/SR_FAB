package com.srfab.services;

import com.srfab.entities.Order;
import com.srfab.entities.OrderedProduct;
import com.srfab.entities.ProductVariant;
import com.srfab.entities.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.admin.email}")
    private String adminEmail;

    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Email sent to {} : {}", to, subject);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    private String wrapInTemplate(String title, String bodyContent) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;background:#fafafa;font-family:'Segoe UI',Arial,sans-serif;">
              <div style="max-width:600px;margin:20px auto;background:#fff;border:1px solid #e5e5e5;">
                <div style="background:#111;padding:24px 32px;text-align:center;">
                  <h1 style="margin:0;color:#c9a96e;font-size:22px;letter-spacing:3px;">SR FAB</h1>
                  <p style="margin:4px 0 0;color:#999;font-size:11px;letter-spacing:2px;">PREMIUM GARMENTS & FASHION</p>
                </div>
                <div style="padding:32px;">
                  <h2 style="color:#111;font-size:18px;margin:0 0 16px;">%s</h2>
                  %s
                </div>
                <div style="background:#fafafa;padding:16px 32px;text-align:center;border-top:1px solid #e5e5e5;">
                  <p style="margin:0;color:#999;font-size:11px;">© 2026 SR FAB. All rights reserved.</p>
                  <p style="margin:4px 0 0;color:#bbb;font-size:10px;">Premium Garments & Fashion</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(title, bodyContent);
    }

    @Async
    public void sendWelcomeEmail(User user) {
        String body = """
            <p style="color:#333;line-height:1.6;">Dear <strong>%s</strong>,</p>
            <p style="color:#333;line-height:1.6;">Welcome to <strong>SR FAB</strong>! We're thrilled to have you join our family of fashion lovers.</p>
            <div style="background:#f8f4ec;border-left:4px solid #c9a96e;padding:16px;margin:20px 0;">
              <p style="margin:0;color:#111;font-weight:600;">🎉 Special Welcome Offer!</p>
              <p style="margin:8px 0 0;color:#333;">Enjoy <strong style="color:#c9a96e;font-size:18px;">10%% OFF</strong> on your first order! No coupon needed — it's automatically applied.</p>
            </div>
            <p style="color:#333;line-height:1.6;">Start exploring our premium collection of garments crafted with passion and precision.</p>
            <div style="text-align:center;margin:24px 0;">
              <a href="http://localhost:5173/shop" style="background:#111;color:#fff;text-decoration:none;padding:12px 32px;font-size:13px;letter-spacing:2px;font-weight:600;">SHOP NOW</a>
            </div>
            """.formatted(user.getUserName());

        sendHtmlEmail(user.getUserEmail(), "Welcome to SR FAB! 🎉", wrapInTemplate("Welcome, " + user.getUserName() + "!", body));
    }

    @Async
    public void sendOrderConfirmation(Order order) {
        User user = order.getUser();
        StringBuilder itemsHtml = new StringBuilder();
        itemsHtml.append("<table style='width:100%;border-collapse:collapse;margin:16px 0;'>");
        itemsHtml.append("<tr style='background:#f5f5f5;'><th style='padding:8px;text-align:left;font-size:12px;color:#666;'>ITEM</th><th style='padding:8px;text-align:center;font-size:12px;color:#666;'>QTY</th><th style='padding:8px;text-align:right;font-size:12px;color:#666;'>PRICE</th></tr>");

        for (OrderedProduct item : order.getOrderedProducts()) {
            itemsHtml.append("<tr style='border-bottom:1px solid #eee;'>")
                .append("<td style='padding:10px 8px;font-size:13px;'>").append(item.getName())
                .append(item.getSize() != null ? " (" + item.getSize() + "/" + item.getColor() + ")" : "")
                .append("</td>")
                .append("<td style='padding:10px 8px;text-align:center;font-size:13px;'>").append(item.getQuantity()).append("</td>")
                .append("<td style='padding:10px 8px;text-align:right;font-size:13px;'>₹").append(item.getPrice()).append("</td>")
                .append("</tr>");
        }
        itemsHtml.append("</table>");

        String discountHtml = order.getDiscountAmount() > 0
            ? "<tr><td style='padding:6px 8px;font-size:13px;color:#22c55e;'>Discount" +
              (order.getCouponCode() != null ? " (" + order.getCouponCode() + ")" : " (First Order)") +
              "</td><td style='padding:6px 8px;text-align:right;font-size:13px;color:#22c55e;'>-₹" +
              String.format("%.0f", order.getDiscountAmount()) + "</td></tr>"
            : "";

        String body = """
            <p style="color:#333;line-height:1.6;">Dear <strong>%s</strong>,</p>
            <p style="color:#333;line-height:1.6;">Thank you for your order! Here's your order summary:</p>
            <div style="background:#f8f4ec;padding:16px;margin:16px 0;">
              <p style="margin:0;font-size:13px;color:#666;">Order ID: <strong style="color:#111;">%s</strong></p>
              <p style="margin:4px 0 0;font-size:13px;color:#666;">Date: <strong style="color:#111;">%s</strong></p>
              <p style="margin:4px 0 0;font-size:13px;color:#666;">Status: <strong style="color:#c9a96e;">%s</strong></p>
            </div>
            %s
            <table style="width:100%%;margin:8px 0;">
              %s
              <tr style="border-top:2px solid #111;"><td style="padding:10px 8px;font-size:14px;font-weight:700;">Total</td><td style="padding:10px 8px;text-align:right;font-size:14px;font-weight:700;">₹%.0f</td></tr>
            </table>
            %s
            """.formatted(
                user.getUserName(),
                order.getOrderId(),
                order.getDate(),
                order.getStatus(),
                itemsHtml.toString(),
                discountHtml,
                order.getTotalAmount(),
                order.getShippingAddress() != null ? "<p style='font-size:12px;color:#666;margin-top:16px;'>📍 Shipping to: " + order.getShippingAddress() + "</p>" : ""
            );

        sendHtmlEmail(user.getUserEmail(), "Order Confirmed — " + order.getOrderId(), wrapInTemplate("Order Confirmation", body));
    }

    @Async
    public void sendOrderStatusUpdate(Order order) {
        User user = order.getUser();
        String statusEmoji = switch (order.getStatus().toLowerCase()) {
            case "shipped" -> "🚚";
            case "delivered" -> "✅";
            case "cancelled" -> "❌";
            default -> "📦";
        };

        String body = """
            <p style="color:#333;line-height:1.6;">Dear <strong>%s</strong>,</p>
            <p style="color:#333;line-height:1.6;">Your order <strong>%s</strong> has been updated:</p>
            <div style="text-align:center;padding:24px;background:#f8f4ec;margin:16px 0;">
              <p style="font-size:32px;margin:0;">%s</p>
              <p style="font-size:18px;font-weight:700;color:#111;margin:8px 0 0;">%s</p>
            </div>
            """.formatted(user.getUserName(), order.getOrderId(), statusEmoji, order.getStatus());

        sendHtmlEmail(user.getUserEmail(), statusEmoji + " Order " + order.getStatus() + " — " + order.getOrderId(),
            wrapInTemplate("Order Status Update", body));
    }

    @Async
    public void sendPaymentConfirmation(Order order) {
        User user = order.getUser();
        String body = """
            <p style="color:#333;line-height:1.6;">Dear <strong>%s</strong>,</p>
            <p style="color:#333;line-height:1.6;">Your payment has been received successfully.</p>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;margin:16px 0;">
              <p style="margin:0;color:#166534;font-weight:600;">✅ Payment Successful</p>
              <table style="margin-top:12px;font-size:13px;color:#333;">
                <tr><td style="padding:4px 16px 4px 0;color:#666;">Order ID:</td><td><strong>%s</strong></td></tr>
                <tr><td style="padding:4px 16px 4px 0;color:#666;">Amount:</td><td><strong>₹%.0f</strong></td></tr>
                <tr><td style="padding:4px 16px 4px 0;color:#666;">Payment Mode:</td><td><strong>%s</strong></td></tr>
              </table>
            </div>
            """.formatted(user.getUserName(), order.getOrderId(), order.getTotalAmount(), order.getPaymentType());

        sendHtmlEmail(user.getUserEmail(), "Payment Received ✅ — ₹" + String.format("%.0f", order.getTotalAmount()),
            wrapInTemplate("Payment Confirmation", body));
    }

    @Async
    public void sendLowStockAlert(ProductVariant variant, String productName) {
        String body = """
            <p style="color:#333;line-height:1.6;">⚠️ Low stock alert for a product variant:</p>
            <div style="background:#fef2f2;border:1px solid #fecaca;padding:16px;margin:16px 0;">
              <table style="font-size:13px;color:#333;">
                <tr><td style="padding:4px 16px 4px 0;color:#666;">Product:</td><td><strong>%s</strong></td></tr>
                <tr><td style="padding:4px 16px 4px 0;color:#666;">Size:</td><td><strong>%s</strong></td></tr>
                <tr><td style="padding:4px 16px 4px 0;color:#666;">Color:</td><td><strong>%s</strong></td></tr>
                <tr><td style="padding:4px 16px 4px 0;color:#666;">Remaining Stock:</td><td><strong style="color:#dc2626;">%d units</strong></td></tr>
              </table>
            </div>
            <p style="color:#666;font-size:13px;">Please restock this item soon to avoid stockouts.</p>
            """.formatted(productName, variant.getSize(), variant.getColor(), variant.getStock());

        sendHtmlEmail(adminEmail, "⚠️ Low Stock Alert — " + productName,
            wrapInTemplate("Low Stock Alert", body));
    }
}
