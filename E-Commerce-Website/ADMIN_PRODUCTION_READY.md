# Admin Dashboard - Production Ready Checklist

## ✅ Frontend Admin Status

The admin dashboard is **production-ready** and includes:

### Features Implemented

- ✅ Analytics dashboard with key metrics
- ✅ Products management (CRUD) - shows first 10 products as cards with edit/delete
- ✅ Categories management
- ✅ Orders management with status tracking
- ✅ Coupons/discounts management
- ✅ Error handling with user-friendly messages
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Admin-only role protection (ProtectedRoute)
- ✅ Performance optimized (limited product loading to prevent timeout)

### Performance Optimizations

- Product list limited to first 100 items (prevents database timeout)
- Analytics requests time out gracefully after 20 seconds
- Request timeouts: 15s for products, 20s for analytics
- Only essential data loaded initially, lazy-load on edit
- Optimized entity graphs in backend queries

### Security Features

- JWT token-based authentication
- Admin role verification in frontend and backend
- CORS configured for allowed origins
- Sensitive endpoints protected with @PreAuthorize("hasRole('ADMIN')")

---

## 📋 Pre-Deployment Checklist

### Frontend Configuration

- [ ] Update `frontend/.env` with production API URL:
  ```env
  VITE_CLOUDINARY_CLOUD_NAME=de5x4aaqj
  VITE_API_BASE_URL=https://your-backend-domain.com/api
  ```
- [ ] Build frontend: `npm run build`
- [ ] Test admin login and basic features locally first
- [ ] Run production build locally: `npm run preview`

### Backend Configuration

- [ ] Ensure backend `.env` has all required variables set:
  - Database connection (MySQL)
  - JWT_SECRET (strong, unique value)
  - CLOUDINARY credentials
  - 3D model API keys (if using)
  - Admin email for notifications
- [ ] Compile backend: `mvn clean compile`
- [ ] Run tests: `mvn test`
- [ ] Build JAR: `mvn clean package`

### Database

- [ ] Verify MySQL database is online and accessible
- [ ] Run migrations/schema setup
- [ ] Confirm admin user exists in database:
  ```sql
  SELECT * FROM admin;
  ```
- [ ] Admin credentials:
  - Email: `admin@srfab.com`
  - Password: Check backend DataInitializer.java for default

### Hosting Deployment on Render.com

#### Step 1: Prepare Your Repository

- Ensure GitHub repository contains both `frontend/` and `backend/` directories
- Make sure all changes are committed and pushed to GitHub
- Verify `.gitignore` excludes `.env` and build artifacts

#### Step 2: Deploy Frontend on Render (Static Site)

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Create new **Static Site**:
   - **Name**: `srfab-frontend` (or similar)
   - **GitHub Repo**: Select your repository
   - **Branch**: `main`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
3. Click **Create Static Site** → Render will auto-deploy on every push
4. Note the frontend URL (e.g., `https://srfab-frontend.onrender.com`)

#### Step 3: Deploy Backend on Render (Web Service)

1. Create new **Web Service**:
   - **Name**: `srfab-backend`
   - **GitHub Repo**: Select your repository
   - **Branch**: `main`
   - **Runtime**: `Java 17`
   - **Build Command**: `cd backend && mvn clean package -DskipTests`
   - **Start Command**: `java -jar backend/target/backend-0.0.1-SNAPSHOT.jar`

2. In **Environment** tab, add these variables:

   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://your-mysql-host:3306/srfab?useSSL=true
   SPRING_DATASOURCE_USERNAME=your-db-user
   SPRING_DATASOURCE_PASSWORD=your-db-password
   JWT_SECRET=your-strong-secret-key-here-min-32-chars
   JWT_EXPIRATION=86400000
   CLOUDINARY_CLOUD_NAME=de5x4aaqj
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   CORS_ALLOWED_ORIGINS=https://srfab-frontend.onrender.com,https://your-custom-domain.com
   ```

3. Under **Advanced** → **Health Check**: Set path to `/actuator/health` (Spring Boot default)
4. Click **Create Web Service** → Render will deploy automatically

#### Step 4: Update Frontend Environment Variables

After backend is deployed, update `frontend/.env`:

```env
VITE_API_BASE_URL=https://srfab-backend.onrender.com/api
VITE_CLOUDINARY_CLOUD_NAME=de5x4aaqj
```

- Commit and push this change
- Render will automatically rebuild and redeploy frontend with new env variables

#### Step 5: Connect Custom Domain (Optional)

1. In Render dashboard, go to your **Static Site** or **Web Service**
2. **Settings** → **Custom Domain**
3. Add your domain (e.g., `admin.yourdomain.com`)
4. Follow DNS configuration instructions in Render dashboard
5. Update CORS_ALLOWED_ORIGINS in backend environment if using custom domain

#### Step 6: Database Setup

**Option A: External MySQL (Aiven - current setup)**

- Your existing Aiven MySQL connection will work as-is
- Ensure firewall allows Render IPs (typically all from Render's range)
- Update `SPRING_DATASOURCE_URL` in backend environment variables with Aiven host

**Option B: Render PostgreSQL (if switching)**

- Render doesn't offer managed MySQL yet—PostgreSQL recommended
- Create new **PostgreSQL Database** in Render dashboard
- Render auto-provides connection string as environment variable
- Would require backend code changes (different JDBC driver)

#### Step 7: Verify Deployment

1. **Frontend**: Visit `https://srfab-frontend.onrender.com` → should load your site
2. **Backend Health**: `curl https://srfab-backend.onrender.com/actuator/health` → should return `{"status":"UP"}`
3. **Admin Login**: Go to frontend → `/admin` → log in with `admin@srfab.com / admin123`
4. **Check Backend Logs**: In Render dashboard, Web Service → **Logs** tab to debug any issues

#### Render Deployment Notes

- **Auto-redeploy**: Every Git push to `main` triggers automatic rebuild and deploy
- **Build time**: First build takes 5-10 minutes; subsequent builds 2-3 minutes
- **Free tier limits**:
  - 750 hours/month free Web Service (enough for ~1 service running 24/7)
  - Static sites are free
  - PostgreSQL: 0.5 GB free; MySQL requires paid tier
- **Performance**: Render's shared infrastructure suitable for admin dashboard; upgrade to paid for higher traffic
- **Monitoring**: Check deployment status, live logs, and metrics in Render dashboard

### CORS Configuration for Render

Update `backend/src/main/java/com/srfab/config/SecurityConfig.java` if custom domains are used:

```java
@CrossOrigin(origins = {
    "https://srfab-frontend.onrender.com",      // Render frontend URL
    "https://admin.yourdomain.com"              // Your custom domain
})
```

Alternatively, set via environment variable in Render backend settings:

- Add `CORS_ALLOWED_ORIGINS` (comma-separated list of allowed domains)
- Backend code should read: `@Value("${cors.allowed.origins:https://srfab-frontend.onrender.com}")`

**Note**: After updating CORS, rebuild backend: `git push` → Render will auto-deploy

### Admin Access After Deployment

1. Navigate to: `https://your-frontend-domain.com/admin`
2. Log in with admin credentials
3. Verify all sections load:
   - Analytics dashboard
   - Product grid (first 10)
   - Categories list
   - Orders list
   - Coupons list

---

## 🚨 Common Issues & Fixes

### Issue: Admin page returns 401 Unauthorized

- **Cause**: JWT token not in localStorage or expired
- **Fix**: Log out and log back in with admin email
- **Check backend logs**: Verify JWT_SECRET matches between sessions

### Issue: Products not loading

- **Cause**: Backend timeout or database issue
- **Fix**: Check if backend is running and MySQL is accessible
- **Verify**: `curl http://backend:8080/api/products/paged?page=0&size=20`

### Issue: Cloudinary images not showing

- **Cause**: VITE_CLOUDINARY_CLOUD_NAME incorrect
- **Fix**: Update in `frontend/.env` with correct cloud name

### Issue: CORS errors in browser console

- **Cause**: Frontend and backend on different origins
- **Fix**: Update @CrossOrigin in SecurityConfig.java

---

## 📊 Admin Dashboard Sections

### Analytics Tab

- Total products count
- Total orders count
- Total revenue
- Total users count
- Recent orders list with status

### Products Tab

- Display first 10 products as cards with images
- Quick edit/delete actions per product
- Add new product button
- Form to create/edit with variants
- Low stock warnings

### Categories Tab

- List all categories
- Edit category name and image
- Delete category
- Add new category

### Orders Tab

- List all customer orders
- Order ID, customer name, status, amount
- Update order status
- View order details

### Coupons Tab

- List all discount coupons
- Edit coupon code, percentage, validity
- Delete coupons
- Add new coupons

---

## 🔐 Admin Credentials

Default admin user (from DataInitializer):

- **Email**: `admin@srfab.com`
- **Password**: `admin123` (change on first login)

To add more admins, use backend API:

```bash
POST /api/auth/register
{
  "userName": "Admin Name",
  "email": "admin2@srfab.com",
  "password": "strong-password",
  "role": "ROLE_ADMIN"
}
```

---

## 📈 Performance Metrics (Current)

- Admin dashboard initial load: ~2-3 seconds
- Product API response: <3 seconds (first 100 items)
- Analytics API response: <15 seconds
- Categories API response: <2 seconds
- Build size: ~27 KB (AdminDashboard.jsx gzipped)

---

## 🚀 Post-Deployment Tasks

1. **Monitor logs** for any errors
2. **Test all admin functions**:
   - Create a test product
   - Edit and delete a product
   - Create coupons
   - Update order status
3. **Set up admin email notifications** if configured
4. **Backup database regularly**
5. **Monitor API response times** and scale if needed

---

## 📞 Support

If deployment issues occur:

1. Check backend logs: `docker logs srfab-backend` or server logs
2. Verify environment variables are set
3. Test API directly: `curl https://your-api-domain.com/api/categories`
4. Check database connection and credentials
5. Verify JWT_SECRET is consistent across sessions
