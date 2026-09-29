# Lab 3 — Bootstrap Implementation & E-Commerce Store

**Course:** Full Stack Web Development  
**Student:** Nawal Fateh  
**University:** Air University, Islamabad  
**Semester:** 5th (Fall 2026)  
**Section:** BSCS-V-B (Shift-I)  
**Competencies:** CLO-1 &bull; GA-4  

---

## Lab Objectives

1. **Task 1 — Bootstrap Conversion:** Modify all tasks from Lab 2 and implement them using **Bootstrap 5.3**, replacing custom layouts, grids, flexbox, tables, navbars, forms, and cards with Bootstrap utilities while retaining only minimal domain-specific custom CSS.
2. **Task 2 — E-Commerce Store:** Build a complete, responsive e-commerce web application inspired by **ETHNC** ([pk.ethnc.com](https://pk.ethnc.com)), Pakistan's leading ethnic prêt and luxury couture brand, using Bootstrap 5.3 under the strict constraint of **NO JAVASCRIPT**.

---

## Tasks Summary

### [Task 1: Bootstrap Conversion of Lab 2 Tasks](./Task%201/)

Contains a master navigation dashboard ([`Task 1/index.html`](./Task%201/index.html)) providing quick access to all 5 migrated tasks:

| # | Task | Description | Bootstrap Features Applied | Folder |
|---|------|-------------|----------------------------|--------|
| 1 | **Class Timetable** | BSCS-V-B weekly class schedule | `container-fluid`, `table`, `table-bordered`, `table-responsive`, `badge rounded-pill`, flex legend | [Task 1 - Timetable](./Task%201/Task%201%20-%20Timetable/) |
| 2 | **Facebook Homepage** | News feed with 3-column layout | `navbar fixed-top`, responsive grid (`col-lg-3`, `col-lg-6`), `card shadow-sm border-0`, flex alignment | [Task 2 - Facebook](./Task%201/Task%202%20-%20Facebook/) |
| 3 | **Portfolio** | Developer resume and focus areas | `container`, 2-column resume grid (`row g-0`, `col-md-4`, `col-md-8`), `progress`, `badge` | [Task 3 - Portfolio](./Task%201/Task%203%20-%20Portfolio/) |
| 4 | **IEEE Paper Template** | Academic research paper template | `container`, `table table-sm table-bordered`, IEEE two-column flow, formula blocks | [Task 4 - IEEE Paper](./Task%201/Task%204%20-%20IEEE%20Paper/) |
| 5 | **Netflix Landing Page** | Custom UI with media & video | `container`, alternating feature rows (`row`, `flex-md-row-reverse`), `form-floating`, percentage TV video alignment | [Task 5 - CustomUI](./Task%201/Task%205%20-%20CustomUI/) |

---

### [Task 2: ETHNC E-Commerce Store](./Task%202%20-%20EcomStore/)

A high-fashion Pakistani fashion store built strictly with **Bootstrap 5.3 + Custom CSS** and **ZERO JavaScript**:

| Requirement | Implementation & Features | Primary Page |
|---|---|---|
| **Signup** | Registration form with Name, Email, Phone, Password, and Confirm Password | [`signup.html`](./Task%202%20-%20EcomStore/signup.html) |
| **Login** | Sign-in form with Email, Password, Remember Me, Forgot Password, and Social Login | [`login.html`](./Task%202%20-%20EcomStore/login.html) |
| **Navbar** | Sticky top bar with announcement ticker, brand logo, mega-menu links, search, and cart counter | All pages |
| **Hero Section** | 16:9 widescreen editorial banner with "ETHNC COUTURE" overlay, tagline, and CTA | [`index.html`](./Task%202%20-%20EcomStore/index.html) |
| **Product Listing** | 8 authentic Pakistani ethnic outfits across Ready-to-Wear, Unstitched, and Festive collections | [`index.html`](./Task%202%20-%20EcomStore/index.html) |
| **Reviews** | Customer testimonials on homepage + 4.9/5 verified buyer reviews & feedback form | [`index.html`](./Task%202%20-%20EcomStore/index.html), [`product-detail.html`](./Task%202%20-%20EcomStore/product-detail.html) |
| **Add Product to Cart** | Dedicated single-product view with gallery, color/size swatches, size chart modal, and Add to Cart action | [`product-detail.html`](./Task%202%20-%20EcomStore/product-detail.html) |
| **Display Cart** | Shopping cart table with item previews, sizes, prices, subtotal, and tax calculation | [`cart.html`](./Task%202%20-%20EcomStore/cart.html) |
| **Edit Cart** | Quantity increment/decrement triggers, item removal buttons, and promo coupon input | [`cart.html`](./Task%202%20-%20EcomStore/cart.html) |
| **Checkout** | 3-step checkout stepper, Pakistani shipping address form, and 4 payment methods (COD, Card, Bank, JazzCash) | [`checkout.html`](./Task%202%20-%20EcomStore/checkout.html) & [`order-confirmation.html`](./Task%202%20-%20EcomStore/order-confirmation.html) |

---

## Directory Structure

```
Lab 3/
├── README.md                           <-- Master Lab 3 Documentation
├── Task 1/                             <-- Lab 2 Tasks Recreated in Bootstrap
│   ├── index.html                      <-- Task 1 Launcher Dashboard
│   ├── README.md                       <-- Task 1 Technical Documentation
│   ├── Task 1 - Timetable/
│   │   ├── index.html
│   │   └── style.css
│   ├── Task 2 - Facebook/
│   │   ├── index.html
│   │   └── style.css
│   ├── Task 3 - Portfolio/
│   │   ├── index.html
│   │   └── style.css
│   ├── Task 4 - IEEE Paper/
│   │   ├── index.html
│   │   └── style.css
│   └── Task 5 - CustomUI/
│       ├── index.html
│       └── style.css
└── Task 2 - EcomStore/                 <-- ETHNC E-Commerce Application (NO JS)
    ├── README.md                       <-- EcomStore Documentation & Architecture
    ├── index.html                      <-- Homepage & Product Catalog
    ├── product-detail.html             <-- Single Product Detail Page
    ├── cart.html                       <-- Shopping Cart (Display & Edit)
    ├── checkout.html                   <-- Multi-Step Checkout Flow
    ├── order-confirmation.html         <-- Order Receipt & Confirmation
    ├── login.html                      <-- User Sign In
    ├── signup.html                     <-- User Registration
    ├── style.css                       <-- Luxury Brand CSS Theme
    └── assets/                         <-- Product photography & hero banners
```

---

## How to Run

1. Navigate to the `Lab 3/` directory.
2. Open [`Task 1/index.html`](./Task%201/index.html) to launch the **Task 1 Master Dashboard**.
3. Open [`Task 2 - EcomStore/index.html`](./Task%202%20-%20EcomStore/index.html) to launch the **ETHNC E-Commerce Store**.
4. All styles and fonts load automatically via Bootstrap CDN and Google Fonts. No local server, compilers, or build steps required.

---

## Technologies Used

- **Bootstrap 5.3.3** — Responsive Grid, Utilities, Tables, Forms, Modals, Offcanvas, Accordion, and Badges
- **Bootstrap Icons 1.11.3** — Iconography across navigation, product ratings, and checkout
- **HTML5** — Semantic markup, video embeds, and accessible form structures
- **Vanilla CSS3** — Custom typography, animations, color tokens, and domain styling
