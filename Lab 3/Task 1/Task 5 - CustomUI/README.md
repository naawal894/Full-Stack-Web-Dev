# Task 5 — Netflix Landing Page (Custom UI)

A replica of the **Netflix landing page / homepage UI** built using pure HTML & CSS.

## Features

- **Navigation Bar** — Netflix logo with language selector button and sign-in button
- **Hero Section** — Background image with dark overlay, call-to-action typography, email subscription input, and "Get Started" button
- **Feature Showcase Sections** (Alternating 2-column rows):
  - **Enjoy on your TV** — Smart TV graphic with embedded looping video playing inside the screen frame
  - **Download your shows** — Mobile device showcase illustration for offline viewing
  - **Watch everywhere** — Multi-device mockup with embedded looping video stream
  - **Create profiles for kids** — Dedicated kids profile graphic with character artwork
- **Frequently Asked Questions (FAQ)** — Accordion-style expandable question boxes with hover transitions and SVG icons
- **Multi-Column Footer** — Support phone number and 4-column categorized footer navigation links
- **Responsive Layout** — Media queries (`@media max-width: 1300px`) adapting hero inputs, stacking feature rows, resizing media elements, and transitioning the footer to a 2-column grid

## Layout

```
┌─────────────────────────────────────────────┐
│              HEADER & NAVBAR                │
├─────────────────────────────────────────────┤
│                 HERO BANNER                 │
│      (Title + Subtitle + Email CTA)         │
├─────────────────────────────────────────────┤
│  Feature 1: TV + Video Overlay              │
├─────────────────────────────────────────────┤
│  Feature 2: Mobile Download Offline         │
├─────────────────────────────────────────────┤
│  Feature 3: Watch Everywhere + Video Stream │
├─────────────────────────────────────────────┤
│  Feature 4: Kids Profiles                   │
├─────────────────────────────────────────────┤
│  FAQ Section (Accordion Items)              │
├─────────────────────────────────────────────┤
│  Footer (Help & Multi-Column Link Grid)     │
└─────────────────────────────────────────────┘
```

## Files

| File / Folder | Purpose |
|---------------|---------|
| `index.html` | Page markup and structure (Hero, showcase rows, FAQ, Footer) |
| `style.css` | Netflix dark theme styling, typography, video overlay positioning, and responsive media queries |
| `Assets/` | Local static assets (images and media) |
| `favicon.ico` | Page shortcut icon |

## Fonts & Styling

- **Fonts:** [Poppins](https://fonts.google.com/specimen/Poppins) & [Martel Sans](https://fonts.google.com/specimen/Martel+Sans) via Google Fonts
- **Theme:** Dark mode background (`#000000`), signature Netflix red accents (`#ff0000` / `red`), and smooth interactive hover states
