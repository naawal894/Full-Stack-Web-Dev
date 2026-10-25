# Lab 7 — In-Memory & Persistent REST APIs in Node.js

**Course:** Full Stack Web Development (CS-301L)  
**Student:** Nawal Fateh  
**University:** Air University, Islamabad  
**Semester:** 5th (Fall 2026)  
**Section:** BSCS-V-B (Shift-I)  

---

## Overview

Lab 7 focuses on building RESTful Web APIs using native Node.js (`node:http`, `node:fs/promises`, `node:events`):
1. **Task 1: Student Management System (In-Memory API)** — An in-memory CRUD service managing Students, Teachers, Attendances, and Marks without external dependencies or authorization.
2. **Task 2: ETHNC E-Commerce Store (Persistent API)** — A persistent file-based REST API based on the **ETHNC** couture store from Lab 3 Task 2, managing Users, Products, Shopping Cart, and Orders with atomic file persistence (`fs.writeFile` + `fs.rename`).

---

## Directory Structure

```
Lab Tasks/Lab 7/
├── 01-memory-api.js                # Task 1: In-Memory Student Management System
├── package.json                    # Scripts for running both APIs and test suite
├── README.md                       # Comprehensive documentation and API manual
└── 02-persistent-api/              # Task 2: Persistent E-Commerce REST API
    ├── server.js                   # Server entry point (Port 3006)
    ├── app.js                      # HTTP Request dispatcher, routes & event emitter
    ├── store.js                    # Persistent JSON store with queue & atomic file replacement
    ├── validate.js                 # Validation helpers and custom HttpError
    ├── data/                       # JSON persistence directory
    │   ├── products.json           # 8 seeded ETHNC couture products (from Lab 3)
    │   ├── users.json              # Registered customers
    │   ├── carts.json              # Per-user active carts
    │   └── orders.json             # Customer orders & shipment tracking
    └── test/
        └── api.test.js             # Automated test suite using Node's native test runner
```

---

## Task 1 — Student Management System (In-Memory API)

File: [`01-memory-api.js`](file:///d:/University/Semester%20V/Full%20Stack%20Web%20Development/Full-Stack-Web-Dev/Lab%20Tasks/Lab%207/01-memory-api.js)  
Default Port: `3005`

### Architecture & Features
- Built on top of the class in-memory reference (`01-memory-api.js`), generalized using a factory router `createCRUD()`.
- Supports 4 comprehensive academic modules:
  - **Student** (CRUD)
  - **Teacher** (CRUD)
  - **Attendance** (CRUD)
  - **Marks** (CRUD)
- In-memory state stored in isolated JS arrays with auto-incrementing integer IDs.
- Validates required fields, checks payloads, handles 404 (Not Found), 405 (Method Not Allowed), 400 (Bad Request), 413 (Payload Too Large), and 415 (Unsupported Media Type).

### Endpoints Specification

| Module | Method | Endpoint | Description | Payload / Fields |
|---|---|---|---|---|
| **Health** | `GET` | `/health` | Server health check | None |
| **Students** | `GET` | `/students` | List all students | None |
| | `POST` | `/students` | Create student | `{ "name": "Ali", "email": "ali@uni.edu", "department": "CS" }` |
| | `GET` | `/students/:id` | Get student details | None |
| | `PUT` | `/students/:id` | Replace student | `{ "name": "Ali Khan", "email": "ak@uni.edu", "department": "SE" }` |
| | `PATCH` | `/students/:id` | Partial update | `{ "department": "AI" }` |
| | `DELETE` | `/students/:id` | Remove student | None |
| **Teachers** | `GET` | `/teachers` | List all teachers | None |
| | `POST` | `/teachers` | Create teacher | `{ "name": "Dr. Ahmed", "email": "ahmed@uni.edu", "subject": "Web Dev" }` |
| | `GET` | `/teachers/:id` | Get teacher details | None |
| | `PUT` | `/teachers/:id` | Replace teacher | Full object required |
| | `PATCH` | `/teachers/:id` | Partial update | Partial fields |
| | `DELETE` | `/teachers/:id` | Remove teacher | None |
| **Attendance** | `GET` | `/attendances` | List all records | None |
| | `POST` | `/attendances` | Log attendance | `{ "studentId": 1, "date": "2026-10-25", "status": "Present" }` |
| | `GET` | `/attendances/:id` | Get record | None |
| | `PUT` | `/attendances/:id` | Replace record | Full fields |
| | `PATCH` | `/attendances/:id` | Update status | `{ "status": "Late" }` |
| | `DELETE` | `/attendances/:id` | Remove record | None |
| **Marks** | `GET` | `/marks` | List all marks | None |
| | `POST` | `/marks` | Record marks | `{ "studentId": 1, "subject": "Web Dev", "obtainedMarks": 85, "totalMarks": 100 }` |
| | `GET` | `/marks/:id` | Get marks record | None |
| | `PUT` | `/marks/:id` | Replace record | Full fields |
| | `PATCH` | `/marks/:id` | Update marks | `{ "obtainedMarks": 92 }` |
| | `DELETE` | `/marks/:id` | Remove record | None |

### Running Task 1

```bash
# From repository root or Lab 7 folder:
node "Lab Tasks/Lab 7/01-memory-api.js"

# Or via npm:
npm run start:memory
```

---

## Task 2 — ETHNC E-Commerce Store (Persistent API)

Directory: [`02-persistent-api/`](file:///d:/University/Semester%20V/Full%20Stack%20Web%20Development/Full-Stack-Web-Dev/Lab%20Tasks/Lab%207/02-persistent-api/)  
Default Port: `3006`

### Architecture & Persistence Strategy
- Based on the storefront entities from **Lab 3 Task 2 (ETHNC Brand Replica)**:
  - **Users / Accounts**: Signup, profile updates, and duplicate email prevention.
  - **Product Catalog**: Seeded with the 8 luxury couture items from Lab 3 (Embroidered Suit, Kurta, Chiffon Formal, Velvet Ensemble, etc.), with category filtering (`?category=Unstitched`).
  - **Cart**: Per-user shopping cart supporting item additions with size/color variants, quantity increment/decrement, single item removal, and full cart clearing.
  - **Orders & Checkout**: Order placement directly from the customer's active cart. Automatically computes order subtotal, shipping fee rules (Free Shipping above PKR 5,000 as advertised in Lab 3 banner), updates inventory, records Pakistani delivery addresses, and flushes the shopping cart.
- **Persistence Mechanism**:
  - Implements transactional atomic writes: writes JSON data to a unique temporary file (`${file}.${uuid}.tmp`) and uses `fs.rename` to replace the target file atomically.
  - Employs a Promise-based `writeQueue` to guarantee serialized, race-free reads and writes without data corruption.

### Endpoints Specification

#### 1. Customers / Users (`/users`)
- `GET /users` — List all registered users
- `POST /users` — Register a customer (`name`, `email`, `password`, `phone`)
- `GET /users/:id` — Retrieve customer profile
- `PUT /users/:id` — Replace customer profile
- `PATCH /users/:id` — Update fields (e.g. phone, address)
- `DELETE /users/:id` — Remove user account

#### 2. Products Catalog (`/products`)
- `GET /products` — List all products (supports query `?category=Eastern Pret` or `?category=Unstitched`)
- `POST /products` — Add a new product (`name`, `category`, `price`, `stock`, `description`)
- `GET /products/:id` — Get product details
- `PUT /products/:id` — Full update of product details
- `PATCH /products/:id` — Partial update (e.g., update price or stock count)
- `DELETE /products/:id` — Remove product

#### 3. Shopping Cart (`/cart/:userId`)
- `GET /cart/:userId` — View user's current shopping cart
- `POST /cart/:userId` — Add item (`productId`, `quantity`, `size`, `color`)
- `PATCH /cart/:userId` — Update item quantity in cart (`productId`, `quantity`)
- `DELETE /cart/:userId` — Remove specific product from cart (`productId`)
- `DELETE /cart/:userId/clear` — Clear entire shopping cart

#### 4. Orders & Checkout (`/orders`)
- `POST /orders` — Place order from cart (`userId`, `shippingAddress`, `paymentMethod`)
- `GET /orders` — List all orders
- `GET /orders/:id` — Get single order receipt & status
- `GET /orders/user/:userId` — Get all orders placed by specific user
- `PATCH /orders/:id` — Update shipment tracking status (`Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`)
- `DELETE /orders/:id` — Cancel active order

### Running Task 2

```bash
# Start the persistent server:
node "Lab Tasks/Lab 7/02-persistent-api/server.js"

# Or via npm:
npm run start:persistent
```

---

## Automated Integration Testing

An automated test suite using Node.js's native test runner (`node:test` and `node:assert/strict`) validates the persistent e-commerce API across normal, boundary, and error cases (duplicate emails, cart calculation, order clearing, state transitions).

### Running Tests

```bash
node --test "Lab Tasks/Lab 7/02-persistent-api/test/api.test.js"

# Or via npm:
npm test
```

### Test Suite Execution Output
```
✔ GET /health returns status ok
✔ POST /users registers a new customer
✔ POST /users rejects duplicate email
✔ POST /products adds a catalog item
✔ GET /products lists catalog items
✔ GET /cart/1 initially returns empty items
✔ POST /cart/1 adds item to cart
✔ PATCH /cart/1 updates item quantity
✔ POST /orders creates order from user cart and clears cart
✔ GET /orders/user/1 returns orders for user
✔ PATCH /orders/1 updates order tracking status
✔ DELETE /orders/1 cancels active order
ℹ pass 12 | fail 0 | cancelled 0
```
