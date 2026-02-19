<<<<<<< HEAD
# SR FAB - Premium Garments & Fashion Store

## Overview
SR FAB is a full-stack fashion e-commerce platform built with **Spring Boot** (Backend) and **React + Vite + Tailwind CSS** (Frontend).

## Project Structure
```
├── backend/     Spring Boot (Java 17, Maven, MySQL, JWT)
├── frontend/    React (Vite, Tailwind CSS, Context API)
└── eazydeals_maven.sql   Database schema
```

## How to Run

### 1. Database
- Ensure MySQL is running.
- Restore schema from `eazydeals_maven.sql` if needed.
- Update `backend/src/main/resources/application.properties` with DB credentials.

### 2. Backend
```bash
cd backend
mvn spring-boot:run
```
Server runs at `http://localhost:8080`.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Client runs at `http://localhost:5173`.

> **Note**: The backend must be running before the frontend loads data. The `ECONNREFUSED` error on `/api/products` is expected if the backend is not started.

## Features
- **Fashion Catalog**: Browse garments by category (Men's, Women's, Ethnic, Kids, Footwear, Accessories).
- **Product Details**: Size selector, color, material info, care instructions.
- **Shopping Bag**: Slide-over cart with quantity controls.
- **Checkout**: COD & Card payment options.
- **Admin**: Manage products, categories, and orders.
- **Security**: Stateless JWT authentication.
=======
# SR_FAB
>>>>>>> 7dafccd (commited)
