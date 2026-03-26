# SR FAB: Master Technical Report & Workflow Documentation
## The Definitive Guide to the Premium E-Commerce Visualization Ecosystem

---

## 1. Executive Summary
**SR FAB** is a high-fidelity, full-stack e-commerce solution designed for the premium fashion sector. It distinguishes itself through an integrated **3D Visualization Pipeline** and a high-performance **Reactive Frontend**. The system is built on an N-tier architecture utilizing **Spring Boot** (Backend) and **React 19** (Frontend), with a heavy focus on automation through Node.js-based utility workflows.

---

## 2. Comprehensive System Architecture

### 2.1 Technology Stack (Dependency Tree)

#### Backend (Maven)
The backend is a Spring Boot application managing micro-services for auth, catalog, and 3D generation.
- **Spring Boot Starter Web:** REST API foundation.
- **Spring Data JPA & MySQL:** Persistence layer.
- **Spring Security & JJWT:** Stateless authentication.
- **Cloudinary:** Media asset management via `com.cloudinary:cloudinary-http45`.
- **Spring Dotenv:** Environment variable management.

#### Frontend (NPM)
The frontend is built with **Vite** for optimized HMR and bundling.
- **Three.js Ecosystem:** `@react-three/fiber`, `@react-three/drei`, and `three` for 3D rendering.
- **State Management:** React Context API (Auth, Cart, Theme).
- **Styling:** Tailwind CSS 4 with Glassmorphism support.
- **Animation:** Framer Motion for UI transitions.

---

## 3. Core Functional Logic

### 3.1 Authentication Workflow (JWT Security)
1. **User Login:** `AuthService` validates credentials against the `UserRepository`.
2. **Token Generation:** Upon success, `JwtUtil` signs a HS256 JWT with user roles.
3. **Frontend Interceptor:** The `axios.js` wrapper automatically injects the `Authorization: Bearer <token>` header into every outgoing request from `localStorage`.

### 3.2 3D Visualization Logic
1. **Model Management:** `Model3DService` tracks generation jobs and GLB URLs.
2. **React Fiber Pipeline:** The `ModelViewer.jsx` component creates a WebGL scene.
3. **Draco Decompression:** Models are loaded using `useGLTF` with a Draco decoder to ensure minimal bandwidth usage.
4. **Interactive Swatches:** The 3D mesh material colors are updated in real-time as users toggle variant colors in the UI.

### 3.3 Style-Family Product Grouping
A custom utility (`productGrouping.js`) identifies products with the same base name but different color suffixes and aggregates them into a single "Style Family" for a cleaner catalog UI.

---

## 4. Automation & Data Workflows (The `scripts/` Ecosystem)

SR FAB uses a suite of Node.js scripts to automate the data-to-deployment pipeline:

### 4.1 Images Generation Workflow (`build_*_images.js`)
- **Logic:** These scripts process base images, apply color tints, and save standardized PNGs to the `catalog/` directory.
- **Automation:** Ensures 100% naming consistency across 400+ product variations.

### 4.2 SQL Seeding Workflow (`generate_*_sql.js`)
- **Logic:** Programmatically generates bulk `INSERT` statements for the MySQL database.
- **Detail:** Calculates SKUs, product IDs, and variant relationships (sizes S-XXL) automatically.

### 4.3 Database Synchronization (`update_lounge_db.js`)
- **Logic:** A master orchestration script that executes SQL generation and then pipes the output directly into the `mysql` CLI.
- **Workflow:** Drops old data -> Generates New SQL -> Updates Database state.

---

## 5. Verification & Validation Walkthrough

### 5.1 Verification Logic (Step-by-Step)

| Step | Action | Expected Logic Output |
| :--- | :--- | :--- |
| **1** | System Boot | Backend starts on 8080; Frontend on 5173. Proxy connects them. |
| **2** | Auth Test | Login response returns a signed JWT. UI role changes to 'Customer' or 'Admin'. |
| **3** | Catalog Load | `ProductController` returns JSON; `productGrouping` aggregates family styles. |
| **4** | 3D Interaction | Clicking '3D View' mounts the Canvas; loading spinner shows until Draco decode completes. |
| **5** | Cart Logic | Adding to cart triggers `CartContext` to POST to `/api/cart/add`; Navbar badge updates live via state sub. |
| **6** | Checkout Flow | `OrderService` validates stock in `product_variant` before placing order. |

### 5.2 Build & Test Commands
```bash
# Verify Backend Integrity
mvn clean install

# Verify Frontend Production Build
npm run build

# Verify Automation Scripts
node scripts/generate_shirt_sql.js
```

---

## 6. Functional Module Mapping

### Backend Controllers
- **`AuthController`:** Endpoints for `/api/auth/login` and registration.
- **`ProductController`:** Handles catalog retrieval and filtering.
- **`Model3DController`:** Manages 3D generation jobs and status polling.
- **`CartController`:** Persistent shopping bag logic.

### Frontend Components
- **`Navbar`:** Global state awareness (Badge/Auth).
- **`Shop`:** Data-driven list rendering with category filtering.
- **`ModelViewerModal`:** Portal-based immersive 3D viewer.
- **`AdminDashboard`:** Multi-tab interface for CRUD and Analytics.

---

## 7. Conclusion
SR FAB is a highly automated fashion ecosystem. By combining **Spring Boot's** enterprise reliability with **Three.js** visual innovation and Node.js-driven data workflows, it provides a reference implementation for modern 3D e-commerce.

---
**Report Generated:** March 16, 2026
**Status:** Comprehensive Analysis Complete
