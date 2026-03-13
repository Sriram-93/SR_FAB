# SR FAB Frontend Technical Documentation (Detailed)

## 1. Scope of This Document
This document is frontend-only and covers the React application under `frontend/` in detail.

Included:
- Frontend architecture
- Entry points and route-level behavior
- Context/state management
- Every page/component role
- API integration map from frontend side
- Styling, theming, animation, and UX behavior
- Build/run and deployment-ready frontend notes

Excluded:
- Backend implementation internals
- Database schema and backend service design

## 2. Frontend Stack

### 2.1 Framework and Tooling
- React `19.2.0`
- Vite `7.3.1`
- React Router DOM `7.13.0`
- Axios `1.13.5`
- Tailwind CSS `4.1.18` via `@tailwindcss/vite`
- Framer Motion `12.35.0`
- React Toastify `11.0.5`
- React Icons `5.5.0`

### 2.2 3D Experience Stack
- `three` `0.183.2`
- `@react-three/fiber` `9.5.0`
- `@react-three/drei` `10.7.7`

## 3. Project Layout (Frontend)

```
frontend/
  package.json
  vite.config.js
  src/
    main.jsx
    App.jsx
    index.css
    App.css
    api/
      axios.js
    context/
      AuthContext.jsx
      CartContext.jsx
      ThemeContext.jsx
    components/
      Navbar.jsx
      CartPreview.jsx
      CartItem.jsx
      ProductCard.jsx
      ProtectedRoute.jsx
      ModelViewer.jsx
      ModelViewerModal.jsx
    pages/
      Home.jsx
      Shop.jsx
      ProductDetails.jsx
      Cart.jsx
      Checkout.jsx
      Profile.jsx
      Login.jsx
      Register.jsx
      AdminDashboard.jsx
    utils/
      productGrouping.js
      productImages.js
```

## 4. Runtime Bootstrapping and App Composition

### 4.1 Application Boot (`frontend/src/main.jsx`)
Render tree:
1. `BrowserRouter`
2. `ThemeProvider`
3. `AuthProvider`
4. `CartProvider`
5. `App`
6. `ToastContainer` (bottom-right)

This order matters:
- `CartProvider` depends on authenticated user data from `AuthProvider`.
- All routes/components can access theme/auth/cart state globally.

### 4.2 Top-Level App Container (`frontend/src/App.jsx`)
- Mounts persistent shell components:
  - `Navbar`
  - `CartPreview` (drawer)
- Maintains local state:
  - `cartOpen` boolean for drawer visibility
- Defines all routes and protected route wrappers.

## 5. Routing and Access Control

### 5.1 Public Routes
- `/` -> `Home`
- `/shop` -> `Shop`
- `/login` -> `Login`
- `/register` -> `Register`
- `/product/:id` -> `ProductDetails`

### 5.2 Authenticated Routes (`ProtectedRoute`)
- `/cart` -> `Cart`
- `/checkout` -> `Checkout`
- `/profile` -> `Profile`

### 5.3 Admin Route
- `/admin` -> `AdminDashboard` with `adminOnly` guard

### 5.4 Route Guard Behavior (`frontend/src/components/ProtectedRoute.jsx`)
- If `loading`: renders `Loading...`
- If no user: redirects to `/login`
- If `adminOnly` and role is not `ROLE_ADMIN`: redirects to `/`
- Else: renders child route component

## 6. Global State and Context Design

### 6.1 Auth Context (`frontend/src/context/AuthContext.jsx`)
Responsibilities:
- Decode JWT payload client-side (`decodeJwt`) for bootstrap session
- Restore user from token on refresh
- Clear expired token on startup
- Expose methods: `login`, `register`, `logout`

State:
- `user`: `{ email, role, userId } | null`
- `loading`: static `false` currently

Auth flow:
- `login` calls `/auth/login`
- Saves token in `localStorage`
- Builds user object using response role + decoded token
- Emits toast success/error

### 6.2 Cart Context (`frontend/src/context/CartContext.jsx`)
Responsibilities:
- Maintain global cart badge count
- Refresh count from backend cart state
- Add item to cart globally from any page

State:
- `cartCount`

Methods:
- `refreshCart()` -> GET `/cart/{userId}` and sum quantities
- `addToCart(productId, variantId, quantity)` -> POST `/cart/add`

### 6.3 Theme Context (`frontend/src/context/ThemeContext.jsx`)
Responsibilities:
- Dark/light mode toggle
- Persist preference in `localStorage`
- Sync root class (`document.documentElement.classList`)

State:
- `isDark`

Behavior:
- Uses stored `theme`, otherwise follows OS preference on first load
- Toggles `dark` class for CSS variable switch

## 7. API Client and Request Flow

### 7.1 Axios Instance (`frontend/src/api/axios.js`)
- `baseURL = '/api'`
- Request interceptor injects `Authorization: Bearer <token>` when token exists

### 7.2 Dev Proxy (`frontend/vite.config.js`)
- `/api/*` proxied to `http://localhost:8080`
- Removes CORS friction in local development

### 7.3 Frontend API Endpoint Usage Map

Auth:
- `POST /auth/login`
- `POST /auth/register`

Catalog:
- `GET /products`
- `GET /products/{id}`
- `GET /categories`

Cart:
- `GET /cart/{userId}`
- `POST /cart/add`
- `PUT /cart/{cartId}`
- `DELETE /cart/{cartId}`

Orders:
- `POST /orders/place`
- `GET /orders/user/{userId}`
- `GET /orders`
- `PUT /orders/{orderId}/status`
- `GET /orders/user/{userId}/count`

User:
- `GET /user/{id}`
- `PUT /user/{id}`

Coupons and Newsletter:
- `POST /coupons/validate`
- `GET /admin/coupons`
- `POST /admin/coupons`
- `PUT /admin/coupons/{id}`
- `DELETE /admin/coupons/{id}`
- `POST /subscribe`

Analytics:
- `GET /admin/analytics`

## 8. Shared Components (Detailed)

### 8.1 Navbar (`frontend/src/components/Navbar.jsx`)
Features:
- Sticky header with scroll-based glass effect
- Desktop and mobile navigation menus
- Search UI (desktop expandable input)
- Theme switch (`FiSun`/`FiMoon`)
- Profile/Login and Logout controls
- Cart icon with dynamic `cartCount` badge

Behavior details:
- Search submits to `/shop?search=<encoded>`
- Category menu action scrolls to `#categories` on home
- If not on home, navigates to `/` then scrolls via timeout

### 8.2 CartPreview Drawer (`frontend/src/components/CartPreview.jsx`)
Features:
- Slide-in side panel over dark blurred backdrop
- Fetches live cart data when opened
- Inline quantity increment/decrement
- Inline item deletion
- Displays subtotal and checkout/view-bag CTAs

Edge behavior:
- If not logged in: prompts sign-in
- Handles image fallback on load failure

### 8.3 ProductCard (`frontend/src/components/ProductCard.jsx`)
Features:
- Product image, branding, discount badge, price display
- Quick action overlay: details + wishlist UI
- 3D modal launch button (`FiBox`)
- Optional style color count display

Performance:
- Lazy-loads `ModelViewerModal` via `React.lazy`

### 8.4 ModelViewer + ModelViewerModal
`frontend/src/components/ModelViewer.jsx`:
- Renders `<Canvas>` scene with lights, environment, shadows
- Supports GLB model via `useGLTF`
- Applies active color over mesh materials
- Fallback placeholder cube if no model URL exists

`frontend/src/components/ModelViewerModal.jsx`:
- Fullscreen immersive modal via portal + Framer Motion
- Body scroll lock while open
- Color swatch controls from product variants
- Temporary test model auto-selection for shirt products (`/models/shirt.glb`)

### 8.5 CartItem (`frontend/src/components/CartItem.jsx`)
- Legacy/simple cart row component style
- Contains quantity controls and remove action
- Uses utility image resolver

## 9. Page-by-Page Details

### 9.1 Home (`frontend/src/pages/Home.jsx`)
Sections:
- Hero block with large background image and CTA
- Animated marquee bar
- Category grid with category-dependent fallback images
- Trending products grid (`groupProductsByStyle` output)
- Newsletter section (`POST /subscribe`)
- Rich footer layout

Data loading:
- Parallel fetch of products and categories on mount

### 9.2 Shop (`frontend/src/pages/Shop.jsx`)
Features:
- Reads URL params: `categoryId`, `search`
- Category filter chips
- Search filtering over name/brand/description/colors
- Product listing based on grouped style products
- Loading skeleton UI and empty-state handling

### 9.3 ProductDetails (`frontend/src/pages/ProductDetails.jsx`)
Features:
- Fetches current product by route param ID
- Fetches full catalog for style-family logic + related products
- Auto variant selection from first variant
- Color and size selectors with stock awareness
- Add-to-cart only enabled for valid in-stock variant
- Related products section (same category, different style)
- Embedded 3D quick experience modal trigger

### 9.4 Cart (`frontend/src/pages/Cart.jsx`)
Features:
- Full cart table-like visual layout
- Quantity updates and remove operations
- Dynamic subtotal/shipping/total summary
- Free shipping threshold message (`₹999`)
- Continue shopping and checkout CTA

### 9.5 Checkout (`frontend/src/pages/Checkout.jsx`)
Features:
- Address prefill from profile endpoint
- First-order discount check (`/orders/user/{id}/count`)
- Coupon apply/remove flow with `/coupons/validate`
- Payment method selector (`COD`, `Card`, `UPI`)
- Order placement via `/orders/place`

Discount logic:
- If coupon applied -> coupon discount used
- Else if first order -> 10% discount used
- Final total recalculated client-side for display

### 9.6 Profile (`frontend/src/pages/Profile.jsx`)
Features:
- Loads profile + order history in parallel
- Edit mode for mutable fields
- Save profile to backend
- Order history cards with status chips and totals

### 9.7 Login and Register
`frontend/src/pages/Login.jsx`:
- Controlled email/password inputs
- Calls `AuthContext.login`
- Redirects to home on success

`frontend/src/pages/Register.jsx`:
- Collects user profile + address basics
- Calls `AuthContext.register`
- Redirects to login on success

### 9.8 AdminDashboard (`frontend/src/pages/AdminDashboard.jsx`)
Tabs:
- Analytics
- Products
- Categories
- Orders
- Coupons

Capabilities:
- Product CRUD with variant editing
- Category CRUD
- Coupon CRUD with validity dates and constraints
- Order list, status updates, and detailed modal view
- Analytics cards + recent orders panel

## 10. Utility Modules

### 10.1 Product Grouping (`frontend/src/utils/productGrouping.js`)
- Detects trailing color terms in product names
- Builds normalized base style names
- Groups products by category + brand + base name
- Produces aggregated display model:
  - `styleProductIds`
  - `styleColors`
  - `styleColorCount`

Purpose:
- Avoid duplicate color variants flooding listing pages

### 10.2 Product Images (`frontend/src/utils/productImages.js`)
- Maps product IDs to curated Unsplash IDs
- Generates deterministic image URLs per product
- Provides common fallback image constant

## 11. Styling System and Visual Language

### 11.1 Global Styles (`frontend/src/index.css`)
- Tailwind v4 + CSS custom properties for theme tokens
- Google fonts:
  - `Manrope` (sans)
  - `Cormorant Garamond` (serif)
- Variables for light/dark:
  - `--primary`, `--accent`, `--surface`, `--bg`, `--line`, etc.

### 11.2 Theme Mechanics
- Light/dark mode uses root-level CSS variable switch via `.dark` class
- Components consume semantic tokenized colors

### 11.3 Animations
Custom keyframes and utilities:
- `slideIn`
- `fadeIn`
- Marquee animation in Home page
- Framer Motion transitions in modal components

### 11.4 App.css
- Intentionally minimal (`Tailwind handles everything`)

## 12. UX and Interaction Patterns

- Toast-driven feedback for major user actions
- Progressive loading patterns:
  - Route-level skeletons (Shop)
  - Spinner placeholders (Profile/Product)
  - Lazy loaded heavy components (3D modal)
- Strong CTA hierarchy with premium visual styling
- Consistent uppercase micro-typography for labels/meta text

## 13. Data Contracts the Frontend Expects

Product object fields used frequently:
- `productId`, `productName`, `productDescription`
- `productPrice`, `productPriceAfterDiscount`, `productDiscount`
- `brand`, `fabricType`, `productImages`
- `category` with `categoryId`, `categoryName`
- `variants` with `variantId`, `size`, `color`, `stock`, `sku`

User fields:
- `userId`, `userName`, `userEmail`, `userPhone`, `userGender`
- `userAddress`, `userCity`, `userPincode`, `userState`

Order fields:
- `id`, `orderId`, `status`, `paymentType`, `date`
- `totalAmount`, `discountAmount`, `orderedProducts`

## 14. Running and Building Frontend

From `frontend/`:

Install:
```bash
npm install
```

Run dev server:
```bash
npm run dev
```

Build production bundle:
```bash
npm run build
```

Preview production bundle:
```bash
npm run preview
```

Lint:
```bash
npm run lint
```

## 15. Known Frontend Observations

- `CartItem.jsx` appears legacy compared with newer cart UI implementation.
- `AuthContext.loading` is currently static; async session bootstrap is minimal.
- Frontend assumes backend availability for all dynamic data paths.
- Some content in 3D modal is currently hardcoded marketing copy/placeholders.

## 16. Frontend Verification Checklist

- App boots with no console/runtime errors
- Theme toggling persists across refresh
- Login/register/logout and route guards work
- Cart badge syncs after add/remove actions
- Shop filtering by category/search works
- ProductDetails variant selection updates stock/add-to-cart behavior
- Checkout discount and coupon logic behaves correctly
- Admin tab workflows execute CRUD successfully
- 3D modal opens/closes and blocks body scroll correctly

---
Document status: frontend-only detailed report generated from current source in `frontend/` as of `2026-03-08`.
