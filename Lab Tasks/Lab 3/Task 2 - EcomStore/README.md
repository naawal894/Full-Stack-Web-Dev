# Task 2 — E-Commerce Store (ETHNC Brand Replica)

**Course:** Full Stack Web Development  
**Student:** Nawal Fateh  
**University:** Air University, Islamabad  
**Semester:** 5th (Fall 2026)  
**Section:** BSCS-V-B (Shift-I)  
**Lab:** Lab 3 — Bootstrap Implementation

---

## Overview

A high-fashion Pakistani e-commerce store inspired by **ETHNC** ([pk.ethnc.com](https://pk.ethnc.com)), Pakistan's premier ethnic prêt and unstitched luxury couture brand.

Built strictly according to **Lab 3 Task 2** requirements:

- **Framework:** Bootstrap 5.3.3 + Bootstrap Icons 1.11.3 + Custom CSS
- **Constraint:** **NO JAVASCRIPT** — all interactivity, form workflows, navigation, layouts, and responsive components are built using pure semantic HTML5, custom CSS3, and declarative Bootstrap data attributes (`data-bs-*`).

---

## Lab Requirements Checklist

| Requirement             | Implementation                                                                                                                                                                                                         | File                                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Signup**              | Registration form with First/Last Name, Email, Phone, Password, Confirm Password, and Sign In link                                                                                                                     | [`signup.html`](./signup.html)                                                             |
| **Login**               | Authentication form with Email, Password, Remember Me check, Forgot Password link, and Google sign-in                                                                                                                  | [`login.html`](./login.html)                                                               |
| **Navbar**              | Sticky top announcement bar, brand logo, desktop categories menu, search, login & cart counter, and responsive mobile offcanvas drawer                                                                                 | All pages                                                                                  |
| **Hero Section**        | Full-width editorial banner featuring 2026 Royal Embrace Collection with call-to-action button                                                                                                                         | [`index.html`](./index.html)                                                               |
| **Product Listing**     | 8-item responsive Bootstrap grid (col-6 col-md-4 col-lg-3) featuring real Pakistani ethnic attire, discount badges, prices, and quick-add actions                                                                      | [`index.html`](./index.html)                                                               |
| **Reviews**             | Customer testimonials on homepage + detailed review rating breakdown (4.9/5) and "Leave a Review" form                                                                                                                 | [`index.html`](./index.html), [`product-detail.html`](./product-detail.html)               |
| **Add Product to Cart** | Dedicated product detail view with multi-angle gallery, color swatches, size pills, quantity selector, size chart modal, and Add to Cart action                                                                        | [`product-detail.html`](./product-detail.html)                                             |
| **Display Cart**        | Responsive shopping Cart table with product thumbnails, descriptions, color/size variants, unit prices, subtotal, and tax calculation                                                                                  | [`cart.html`](./cart.html)                                                                 |
| **Edit Cart**           | Item quantity adjustments (`+`/`−`), item removal triggers, promo coupon code input with apply button, and continue shopping link                                                                                      | [`cart.html`](./cart.html)                                                                 |
| **Checkout**            | 3-step checkout stepper, Pakistani shipping address form (Provinces & major cities dropdown), shipping options, 4 payment methods (COD, Card, Bank, JazzCash/EasyPaisa), order summary, and order confirmation receipt | [`checkout.html`](./checkout.html), [`order-confirmation.html`](./order-confirmation.html) |

---

## User Flow & Site Architecture

```
[ Homepage: index.html ]
   ├── Announcement Bar & Navbar
   ├── Hero Banner ("The Royal Embrace Collection")
   ├── Features Strip (Free Shipping, COD, Easy Returns, Quality)
   ├── Product Listing Grid (8 items with badges & discounts)
   │     │
   │     └── Click Product ───► [ Product Detail: product-detail.html ]
   │                              ├── Image Gallery & Zoom
   │                              ├── Color Swatches & Size Pills
   │                              ├── Size Chart Modal (Bootstrap Modal)
   │                              ├── Product Specs Accordion (Bootstrap Collapse)
   │                              ├── Verified Reviews & Review Submission Form
   │                              └── "Add to Cart" Form Action
   │                                          │
   │                                          ▼
   ├── Category Banners               [ Shopping Cart: cart.html ]
   ├── Customer Reviews                       ├── Display Cart Items Table
   ├── Newsletter Subscription                ├── Edit Cart Quantities
   └── Footer                                 ├── Coupon Input Group
                                              └── "Proceed to Checkout" Button
                                                          │
                                                          ▼
                                              [ Checkout: checkout.html ]
                                                  ├── Shipping & Contact Information
                                                  ├── Pakistani Cities Dropdown
                                                  ├── Payment Method (COD, Card, Bank)
                                                  └── "Place Order" Button
                                                              │
                                                              ▼
                                              [ Order Confirmation: order-confirmation.html ]
                                                  ├── Success Checkmark
                                                  ├── Order #ETH-89412
                                                  ├── Status Timeline (TCS Tracking)
                                                  ├── Delivery Address Receipt
                                                  └── Print Receipt / Continue Shopping

[ Auth Pages ]
   ├── [ Login: login.html ] ────► "Don't have an account?" ───► [ Signup: signup.html ]
   └── [ Signup: signup.html ] ──► "Already have an account?" ──► [ Login: login.html ]
```

---

## File Structure

```
Task 2 - EcomStore/
├── index.html               # Main storefront (Hero, 8 products, reviews, categories, footer)
├── product-detail.html      # Single product view & Add to Cart (gallery, sizes, colors, specs)
├── cart.html                # Display Cart & Edit Cart (quantities, remove, coupon, summary)
├── checkout.html            # Checkout page (shipping, Pakistani cities, COD & payment options)
├── order-confirmation.html  # Order receipt, tracking status, and delivery confirmation
├── login.html               # Account login with social sign-in
├── signup.html              # Account registration with validation styles
├── style.css                # Custom CSS variables, typography, and styling on top of Bootstrap
├── README.md                # Task documentation and report
└── images/                  # Real photography assets for Pakistani couture
    ├── hero-banner.jpg      # Editorial luxury fashion hero banner
    ├── product-1.jpg        # Embroidered Luxury Suit (Maroon)
    ├── product-2.jpg        # Embroidered Kurta (Teal)
    ├── product-3.jpg        # Chiffon Formal Suit (Navy)
    ├── product-4.jpg        # Cotton Kurta (Pink)
    ├── product-5.jpg        # Unstitched Lawn 3-Piece (Olive Green)
    ├── product-6.jpg        # Festive Velvet & Lawn Ensemble (Emerald)
    ├── product-7.jpg        # Chikankari Kurta (White)
    └── product-8.jpg        # Embroidered Formal Suit (Black)
```

---

## Design System & Styling

- **Aesthetic:** Minimalist, editorial monochrome (Black `#000000` & Pure White `#ffffff`) inspired by pk.ethnc.com
- **Typography:**
  - **Headings & Brand:** [`Cormorant Garamond`](https://fonts.google.com/specimen/Cormorant+Garamond) (serif, refined luxury)
  - **Body & UI:** [`Inter`](https://fonts.google.com/specimen/Inter) (clean, legible sans-serif)
- **Bootstrap 5 Components Utilized:**
  - `container`, `row`, `col-12`, `col-md-6`, `col-lg-3` (Responsive Grid)
  - `navbar`, `nav`, `offcanvas-start` (Navigation & Mobile Drawer)
  - `modal` (Size Chart popup)
  - `accordion` / `collapse` (Product details, wash care, return policy)
  - `input-group`, `form-control`, `form-select`, `form-check` (Forms)
  - `badge`, `progress-bar` (Review ratings and product tags)
  - `table`, `table-bordered`, `table-striped` (Size chart and specifications)

---

## How to Run

1. Open `index.html` directly in any modern browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
2. No local web server, npm packages, or build tools required.
3. Completely functions with JavaScript disabled in browser settings, fully satisfying the lab constraint.
