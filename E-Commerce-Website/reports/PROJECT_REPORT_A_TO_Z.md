# SR FAB - Premium E-Commerce Platform Project Report
## Comprehensive A to Z Documentation

---

## 1. Project Overview
**SR FAB** is a state-of-the-art, full-stack e-commerce platform specializing in premium garments and fashion. The application is designed to provide a seamless, high-end shopping experience, blending traditional e-commerce paradigms with modern 3D visualization technology.

### core Vision
To bridge the gap between digital browsing and physical feel by providing immersive 3D product previews, a curated fashion catalog, and a highly responsive, aesthetic user interface.

---

## 2. Technology Stack

### Frontend (Modern React Ecosystem)
- **Framework:** React 19 (Vite bundle)
- **Styling:** Tailwind CSS v4 (Glassmorphism & Adaptive Dark Mode)
- **State Management:** React Context API (Auth, Cart, Theme)
- **Animations:** Framer Motion (Transitions, Micro-interactions)
- **3D Engine:** Three.js with `@react-three/fiber` and `@react-three/drei`
- **Routing:** React Router DOM (v7)
- **Feedback:** React Toastify (Action-driven notifications)

### Backend (Enterprise Java)
- **Framework:** Spring Boot 3.x (Java 17)
- **Security:** Spring Security with Stateless JWT Authentication
- **ORM:** Spring Data JPA (Hibernate)
- **Database:** MySQL 8.x
- **Build Tool:** Maven
- **Cloud Integration:** Cloudinary (Media storage), Hugging Face (AI 3D Generation)

---

## 3. System Architecture

### Frontend Architecture
The frontend follows a **Provider-Consumer** pattern for global state:
1. **ThemeContext:** Handles dark/light mode persistence and system preference sync.
2. **AuthContext:** Manages session bootstrapping, JWT decoding, and persistent login.
3. **CartContext:** Syncs real-time cart state between the sidebar drawer and the backend.

**Key Design Patterns:**
- **Atomic Components:** Reusable buttons, cards, and input fields.
- **Lazy Loading:** 3D Viewer and heavy page modules are loaded on-demand to optimize initial TTM (Time to Interact).
- **Glassmorphism:** Navigation and Modals use backdrop-blur effects for a premium "Apple-like" aesthetic.

### Backend Architecture
The backend is structured using the **N-Tier Controller-Service-Repository** pattern:
- **Controllers:** Expose RESTful endpoints for the frontend.
- **Services:** Encapsulate business logic (e.g., price calculations, discount eligibility).
- **Repositories:** Interface with the MySQL database using Spring Data JPA.
- **Entities:** Define the relational data model.

---

## 4. Key Features (A to Z)

### A - Admin Dashboard
Comprehensive control panel to manage Products, Categories, Orders, and Coupons. Includes real-time analytics visualization.

### B - Brand & Fabric Filtering
Advanced filtering systems in the Shop page to find garments by specific brands or fabric types (e.g., Pure Cotton, Silk).

### C - Cart Management (Global)
A persistent slide-over sidebar allowing users to modify quantities, remove items, and view subtotals without leaving the current page.

### D - Dark Mode (Adaptive)
A systemic dark mode that respects OS settings and identifies the brand's premium aesthetic in low-light environments.

### E - Email & Phone Auth
High-flexibility authentication supporting both standard email login and secure session persistence.

### F - Fashion Style Grouping
A unique utility logic that groups color variants into a single "style product" on listing pages, preventing catalog clutter.

### G - GLB/3D Model Support
Direct integration of Draco-compressed 3D models (GLB) for interactive 3D product viewing.

### H - Hero Sections
Rich, high-resolution hero blocks with animated CTAs and marquee bars for featured sales.

### I - Image Optimization
Dynamic image loading with fallbacks and Cloudinary integration for lightning-fast asset delivery.

### J - JWT Security
Secured stateless communication between frontend and backend via JSON Web Tokens.

### K - Key Performance Metrics
Optimized rendering scripts to ensure smooth performance even when loading complex 3D assets.

### L - Lazy-Loaded 3D Visuals
3D models only load when requested (click-to-view), preserving bandwidth and system resources.

### M - Material UI & UX
Focused on micro-interactions (hover scales, smooth fades) to provide a premium "hand-crafted" feel.

### N - Newsletter Subscription
Integrated subscription system to capture user emails for marketing campaigns.

### O - Order Tracking
Unified view for users to see current and past orders, including status updates from admin.

### P - Product Variants
Complex data model supporting multiple Sizes (S, M, L, XL) and Colors for a single product.

### Q - Quick View (3D)
Immersive 3D modal allowing users to rotate, orbit, and inspect products in 3 space.

### R - Responsive Design
Fully fluid layout from Ultrawide monitors to mobile devices using Tailwind's mobile-first breakpoints.

### S - Search (Smart)
Real-time search functionality covering Product Names, Brands, and Descriptions.

### T - Totals & Discounts
Automatic calculation of first-order discounts (10%) and coupon injections during checkout.

### U - UI Visual Language
Serif headers (Cormorant Garamond) paired with Sans bodies (Manrope) for a high-fashion editorial look.

### V - Variant Stock Awareness
The interface automatically disables "Add to Cart" if a specific size/color combination is out of stock.

### W - Wishlist Management
One-click saving of products for later consideration (integrated into Product Cards).

### X - X-Platform Consistency
Identical features and styling across all modern browsers (Chrome, Safari, Firefox).

### Y - Yield-based Analytics
Admin panel view of sales distribution across categories and top-performing products.

### Z - Zero Friction Checkout
Simplified address management and multiple payment methods (COD, UPI, Card).

---

## 5. The 3D Innovation Pipeline
SR FAB differentiates itself with a **3D Pipeline**:
1. **Admin Trigger:** Admin uploads a 2D image.
2. **AI Generation:** Backend calls Hugging Face (TripoSR or similar) to generate a `.glb` model.
3. **Cloud Storage:** The model is optimized and stored on Cloudinary.
4. **Client View:** Three.js renders the model with real-world physics and lighting.

---

## 6. Database Schema Summary

| Table | Purpose | Key Relationships |
|---|---|---|
| `user` | Client profiles | 1:N with `order`, 1:1 with `wishlist` |
| `admin` | Internal management | Independent |
| `product` | Core catalog items | 1:N with `variants`, N:1 with `category` |
| `category` | Product categorization | N:1 with `product` |
| `product_variant` | SKU specific info | N:1 with `product` |
| `order` | Transaction records | N:1 with `user`, 1:N with `ordered_product` |
| `coupon` | Marketing discounts | Independent |
| `model_3d` | 3D visual metadata | 1:1 with `product` |

---

## 7. Implementation Progress & Roadmap

### DONE
- Complete UI/UX Redesign with Tailwind 4.
- End-to-end JWT Authentication.
- Dynamic Catalog and Filtering.
- Global Cart and Checkout logic.
- 3D Viewer with Draco support and body scroll lock.
- Admin Panel Refinement (Profile link removal, Order management).

### IN PROGRESS
- Live AI 3D Generation integration.
- Advanced Order analytics charts.
- Enhanced Newsletter automation.

### PLANNED
- AR (Augmented Reality) support for "Try it on" mobile views.
- Progressive Web App (PWA) installation.

---

**Report Prepared for:** SR FAB Stakeholders
**Status:** Version 1.0 (March 2026)
