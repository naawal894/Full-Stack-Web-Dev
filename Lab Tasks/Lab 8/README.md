# Lab 8 — NestJS E-Commerce Backend (ETHNC Brand Replica)

**Course:** Full Stack Web Development (CS-301L)  
**Student:** Nawal Fateh  
**University:** Air University, Islamabad  
**Semester:** 5th (Fall 2026)  
**Section:** BSCS-V-B (Shift-I)  

---

## 1. Overview

This project implements the backend REST API for the **ETHNC E-Commerce Store** (originally modeled in **Lab 3 Task 2**) using the **NestJS** enterprise Node.js framework.

### Strict Architectural Constraints Satisfied
- **NO Middleware**: No custom or framework `NestMiddleware` registered.
- **NO Guards**: No `@UseGuards()`, `CanActivate`, or route access barriers.
- **NO Auth**: No JWT tokens, Passport strategies, sessions, or gated endpoints. User identification is passed plainly via route parameters or request bodies (e.g., `userId`).
- **NO Pipeline / Pipes**: No global `ValidationPipe`, no custom `PipeTransform`, and no `ParseIntPipe`. Types and IDs are parsed directly in controllers/services (`Number(id)`), with business validations performed cleanly inside the service layer.
- **ONLY Module, Controller, Service**: Strict pure NestJS architecture with Dependency Injection across feature domains.

---

## 2. Architecture & Modules

The application is structured into four cohesive feature modules connected through the root `AppModule`:

```
Lab Tasks/Lab 8/
├── package.json
├── tsconfig.json
├── nest-cli.json
├── README.md
├── test/
│   └── api.test.js               # 18 automated integration tests (Node native test runner)
└── src/
    ├── main.ts                   # Bootstraps NestJS app on port 3008 (CORS enabled)
    ├── app.controller.ts         # Root info & /health check
    ├── app.module.ts             # Root module importing feature modules
    │
    ├── products/                 # Products & Customer Reviews Domain
    │   ├── products.module.ts
    │   ├── products.controller.ts
    │   ├── products.service.ts
    │   └── data/
    │       └── products.seed.ts  # 8 seeded Pakistani couture products from Lab 3
    │
    ├── users/                    # Customer Management Domain
    │   ├── users.module.ts
    │   ├── users.controller.ts
    │   └── users.service.ts
    │
    ├── cart/                     # Shopping Cart & Promo Domain
    │   ├── cart.module.ts
    │   ├── cart.controller.ts
    │   └── cart.service.ts
    │
    └── orders/                   # Checkout & Orders Domain
        ├── orders.module.ts
        ├── orders.controller.ts
        └── orders.service.ts
```

---

## 3. REST API Specification

### Health & Server Root
- `GET /` — Returns API version, student metadata, and active endpoint map.
- `GET /health` — Returns `{ "status": "ok" }`.

---

### Products & Reviews (`/products`)

| Method | Endpoint | Description | Request Body / Query |
|---|---|---|---|
| `GET` | `/products` | List all 8 couture products (or filter by category) | `?category=Unstitched` |
| `GET` | `/products/:id` | Get single product details, specs, and verified reviews | None |
| `POST` | `/products` | Add new catalog product | `{ "name", "category", "price", "stock", "description", "sizes", "colors" }` |
| `PATCH` | `/products/:id` | Partial update (e.g. price or stock level) | `{ "price": 3200, "stock": 15 }` |
| `DELETE` | `/products/:id` | Delete product from catalog | None |
| `POST` | `/products/:id/reviews` | Submit product review & rating | `{ "reviewerName": "Sana", "rating": 5, "comment": "Great fabric!" }` |

#### Seeded Products (from Lab 3 Task 2):
1. **Embroidered Suit** (Maroon 3-piece, PKR 2,990)
2. **Embroidered Kurta** (Teal raw silk, PKR 4,190)
3. **Chiffon Formal Suit** (Navy luxury formal, PKR 8,490)
4. **Cotton Kurta** (Candy pink casual chic, PKR 2,490)
5. **Unstitched Lawn 3-Piece** (Olive green print, PKR 3,990)
6. **Festive Velvet & Lawn Ensemble** (Emerald green winter formal, PKR 12,990)
7. **Chikankari Kurta** (Crisp ivory white, PKR 4,490)
8. **Embroidered Formal Suit** (Jet black signature festive, PKR 9,990)

---

### Customers / Users (`/users`)

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/users` | List all registered customers | None |
| `GET` | `/users/:id` | Get customer profile details | None |
| `POST` | `/users/signup` | Register new customer account | `{ "name": "Hamza", "email": "hamza@example.com", "phone": "03331234567", "password": "Pass" }` |
| `POST` | `/users/login` | Simple credential validation | `{ "email": "hamza@example.com", "password": "Pass" }` |
| `PUT` | `/users/:id` | Update customer details | `{ "name": "Hamza M.", "phone": "0300..." }` |
| `DELETE` | `/users/:id` | Remove user profile | None |

---

### Shopping Cart (`/cart`)

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/cart/:userId` | View user's shopping cart, items, subtotal & shipping | None |
| `POST` | `/cart/:userId` | Add product variant to cart | `{ "productId": 1, "quantity": 2, "size": "M", "color": "Maroon" }` |
| `PATCH` | `/cart/:userId` | Adjust item quantity in cart | `{ "productId": 1, "quantity": 3 }` |
| `DELETE` | `/cart/:userId/item/:productId` | Remove specific product from user's cart | None |
| `POST` | `/cart/:userId/coupon` | Apply promo coupon (e.g. `ETHNC10` for 10% off) | `{ "code": "ETHNC10" }` |
| `DELETE` | `/cart/:userId/clear` | Clear all items from user's cart | None |

> **Shipping Rule (from Lab 3 hero banner):**  
> If discounted subtotal is **>= PKR 5,000**, Nationwide Shipping is **FREE (PKR 0)**.  
> Otherwise, standard shipping fee is **PKR 250**.

---

### Checkout & Orders (`/orders`)

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/orders` | Place order directly from user's active cart | `{ "userId": 1, "shippingAddress": { "fullName": "Nawal Fateh", "phone": "03001234567", "address": "H 42, St 5", "city": "Islamabad", "province": "Federal Capital" }, "paymentMethod": "Cash on Delivery (COD)" }` |
| `GET` | `/orders` | List all orders placed | None |
| `GET` | `/orders/:id` | Get single order receipt & tracking info | None |
| `GET` | `/orders/user/:userId` | Get order history for specific user | None |
| `PATCH` | `/orders/:id/status` | Update tracking status (`Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`) | `{ "status": "Shipped" }` |
| `DELETE` | `/orders/:id` | Cancel order and automatically restore product inventory | None |

---

## 4. How to Run the Application

### 1. Build the TypeScript Project
```bash
# From within "Lab Tasks/Lab 8"
npm run build
```

### 2. Start the NestJS Backend Server
```bash
npm start
# OR for live watch reload:
npm run start:dev
```
The server will start listening at **`http://localhost:3008`**.

---

## 5. Automated Integration Testing

An automated test suite using Node.js's native test runner (`node:test` and `node:assert/strict`) runs against the NestJS application without requiring third-party testing bloat:

```bash
npm test
```

### Test Suite Execution Output
```
✔ 1. GET /health returns status ok (221.09ms)
✔ 2. GET / returns application info and endpoint manifest (15.4706ms)
✔ 3. GET /products returns the 8 seeded Pakistani couture products (10.2409ms)
✔ 4. GET /products?category=Unstitched filters catalog (8.354ms)
✔ 5. GET /products/1 retrieves single product details with reviews (6.4731ms)
✔ 6. POST /products/1/reviews adds a customer review (69.4069ms)
✔ 7. POST /users/signup registers a new customer (7.4329ms)
✔ 8. POST /users/signup rejects duplicate email with 409 Conflict (10.2484ms)
✔ 9. POST /users/login logs in with valid credentials (8.0265ms)
✔ 10. POST /users/login rejects incorrect password with 400 Bad Request (6.1642ms)
✔ 11. GET /cart/1 returns empty cart initially (6.3809ms)
✔ 12. POST /cart/1 adds product variant to shopping cart (9.8629ms)
✔ 13. POST /cart/1/coupon applies promo code ETHNC10 (10% off) (6.9437ms)
✔ 14. PATCH /cart/1 adjusts item quantity (4.8884ms)
✔ 15. POST /orders creates order from user cart, deducts stock and clears cart (18.5498ms)
✔ 16. GET /orders/1 retrieves order receipt (3.3409ms)
✔ 17. PATCH /orders/1/status advances tracking status (4.509ms)
✔ 18. DELETE /orders/1 cancels order and restores inventory (7.1902ms)
ℹ tests 18 | pass 18 | fail 0 | cancelled 0 | skipped 0
```
