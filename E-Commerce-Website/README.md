# SR FAB - Premium Garments & Fashion Store

## Overview

SR FAB is a full-stack fashion e-commerce platform built with **Spring Boot** (Backend) and **React + Vite + Tailwind CSS** (Frontend).

## Project Structure

```
├── backend/     Spring Boot (Java 17, Maven, MySQL, JWT)
├── frontend/    React (Vite, Tailwind CSS, Context API)
└── srfab_maven.sql   Database schema
```

## How to Run

### 1. Database

- Ensure MySQL is running.
- Restore schema from `srfab_maven.sql` if needed.
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

## 3D Pipeline Setup (Hugging Face -> Cloudinary -> User View)

Use `backend/.env` (already supported by `spring-dotenv`) and set:

```bash
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

AI_3D_PROVIDER=hf
HF_API_TOKEN=hf_xxx
HF_3D_MODEL_ID=your_model_id
HF_INFERENCE_BASE_URL=https://router.huggingface.co/hf-inference/models

MODEL_OUTPUT_FORMAT=glb
MODEL_CLOUDINARY_FOLDER=products/3d-models
```

Run migration SQL once:

```bash
# creates model_3d and model_generation_job tables
backend/src/main/resources/db/model_3d_migration.sql
```

Optional local demo model seed:

```bash
# links first cotton shirt product to frontend/public/models/shirt.glb
backend/src/main/resources/db/sample_cotton_shirts_3d.sql
```

Validate setup:

1. Start backend: `cd backend && mvn spring-boot:run`
2. Start frontend: `cd frontend && npm install && npm run dev`
3. Open product details and click `Generate 3D from Image` (admin flow)
4. Poll API: `GET /api/models/generate/{jobId}`
5. Verify final metadata: `GET /api/models/product/{productId}` has `status=ready` and `modelUrl`

User visibility behavior:

- Generation is admin-triggered.
- Viewing 3D model metadata is public (`GET /api/models/**`).

## Features

- **Fashion Catalog**: Browse garments by category (Men's, Women's, Ethnic, Kids, Footwear, Accessories).
- **Product Details**: Size selector, color, material info, care instructions.
- **Shopping Bag**: Slide-over cart with quantity controls.
- **Checkout**: COD & Card payment options.
- **Admin**: Manage products, categories, and orders.
- **Security**: Stateless JWT authentication.
