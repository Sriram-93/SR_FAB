# SR FAB - Premium Garments & Fashion Store

SR FAB is a modern, full-stack e-commerce platform designed for fashion retail. Built with a robust **Spring Boot** backend and a dynamic **React** frontend, it offers a seamless shopping experience with features like product filtering, secure checkout, and a comprehensive admin dashboard.

---

## 🚀 Tech Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS** (Styling & Responsive Design)
- **React Router DOM** (Navigation)
- **Axios** (API Integration)
- **React Toastify** (Notifications)
- **Lucide React / React Icons** (Iconography)

### Backend
- **Java 17**
- **Spring Boot 3** (REST API)
- **Spring Security + JWT** (Authentication & Authorization)
- **Spring Data JPA** (Hibernate)
- **MySQL 8.0** (Database)
- **Maven** (Build Tool)

---

## ✨ Features

### 🛍️ User Features
- **Browse & Search**: Explore products by category (Men, Women, Kids, etc.) or search by name.
- **Product Details**: View detailed product information, select sizes/colors, and check stock availability.
- **Shopping Cart**: Add items to the cart, update quantities, and view real-time price summaries.
- **Wishlist**: Save favorite items for later.
- **Checkout Process**: Secure checkout with address input and payment selection (COD / Online Mock).
- **Order History**: View past orders and their status.
- **Profile Management**: Update user details and addresses.

### 🛠️ Admin Dashboard
- **Analytics**: View total sales, revenue, and order statistics.
- **Product Management**: Add, edit, and delete products and variants.
- **Order Management**: View all orders, update order status (Shipped, Delivered), and view shipping details.
- **User Management**: Monitor registered users.

### 🔒 Security
- **JWT Authentication**: Stateless, secure login for both users and admins.
- **Role-Based Access Control (RBAC)**: Protected routes ensuring only admins can access the dashboard.
- **Password Encryption**: BCrypt hashing for user passwords.

---

## 🛠️ Installation & Run Guide

### Prerequisites
- **Java 17** or higher
- **Node.js 18** or higher
- **MySQL 8.0**
- **Maven**

### 1. Database Setup
1. Open your MySQL client (Workbench, CLI, etc.).
2. Create a new database named `eazydeals`:
   ```sql
   CREATE DATABASE eazydeals;
   ```
3. Import the provided schema file to create tables and seed data:
   ```bash
   mysql -u root -p eazydeals < database_schema.sql
   ```
   *(Or simply import `database_schema.sql` using your preferred SQL GUI tool)*.

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Configure your database credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/eazydeals
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   The backend server will start at `http://localhost:8080`.

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## 🔑 Default Credentials

You can use the following credentials to test the application (from `database_schema.sql`):

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `test@gmail.com` | `abc123` |
| **User** | `test786@gmail.com` | `abc123` |

---

## 📂 Project Structure

```
SR FAB/
├── backend/                # Spring Boot Backend Code
│   ├── src/main/java       # Controllers, Services, Entities, Repositories
│   └── src/main/resources  # Config (application.properties)
├── frontend/               # React Frontend Code
│   ├── src/components      # Reusable UI Components
│   ├── src/pages           # Page Views (Home, Shop, Admin, etc.)
│   └── src/context         # State Management (Auth, Cart)
└── database_schema.sql     # Database Structure & Seed Data
```

---

## 📞 Contact / Support
For any questions or support, please open an issue in the repository.
