# Lab 3 — Task 1: Bootstrap Conversion of Lab 2 Tasks

**Course:** Full Stack Web Development  
**Student:** Nawal Fateh  
**University:** Air University, Islamabad  
**Semester:** 5th (Fall 2026)  
**Section:** BSCS-V-B (Shift-I)  
**Lab Requirement:** *1. Modify all tasks of lab 2 and implement them using bootstrap.*

---

## Architecture: Bootstrap-First with Minimal Custom CSS

In accordance with strict frontend development practices, **all tasks prioritize Bootstrap 5.3 utilities and components**. Custom CSS files (`style.css`) have been pruned of redundant layout, spacing, and reset rules, and **strictly retained ONLY for styling that Bootstrap cannot natively provide**:

| Category | Handled by Bootstrap 5.3 | Kept in Custom `style.css` |
|---|---|---|
| **Layout & Grid** | `container`, `row`, `col-*`, responsive flexbox (`d-flex`, `flex-column`, `flex-md-row`, `justify-content-*`, `align-items-*`) | *None (100% Bootstrap)* |
| **Spacing & Sizing** | `p-*`, `m-*`, `gap-*`, `mx-auto`, `w-100`, `h-100` | *None (100% Bootstrap)* |
| **Components** | `navbar`, `card`, `table`, `table-bordered`, `btn`, `btn-danger`, `btn-lg`, `form-control`, `badge`, `progress` | *None (100% Bootstrap)* |
| **Domain Colors** | Default Bootstrap theme colors | Custom palettes: Air University course pastel tones, Facebook `#1877f2`, Netflix `#e50914` |
| **Media & Mockups** | Responsive images (`img-fluid`) | TV & device frame percentage video alignment (`top: 20.8%`, `left: 13.1%`, `width: 72.8%`, `height: 54.6%`) |
| **Specialized Layouts** | Standard column grids | IEEE 2-column print text flow (`column-count: 2`) & resume vertical timeline tracks |

---

## Tasks Overview & Bootstrap Implementation Details

| # | Task | Description | Bootstrap Features Applied | Custom CSS Retained | Folder |
|---|------|-------------|----------------------------|---------------------|--------|
| 1 | **Class Timetable** | Weekly schedule for BSCS-V-B | `container-fluid`, `table`, `table-bordered`, `table-responsive`, `badge rounded-pill`, flex utilities | Course pastel color variables, day cell colored left accent line, sticky header | [Task 1 - Timetable](./Task%201%20-%20Timetable/) |
| 2 | **Facebook Homepage** | Full Facebook news feed | `navbar fixed-top`, 3-column responsive grid (`col-lg-3`, `col-lg-6`), `card shadow-sm border-0`, flex alignment | Facebook brand tokens, story cards carousel, avatar circles, reaction hover states | [Task 2 - Facebook](./Task%202%20-%20Facebook/) |
| 3 | **Portfolio** | Developer resume & portfolio | `container`, 2-column resume layout (`row g-0`, `col-md-4`, `col-md-8`), `progress`, `progress-bar`, `badge` | Vertical timeline track & node dots, skill tag chips, contact bar pill styling | [Task 3 - Portfolio](./Task%203%20-%20Portfolio/) |
| 4 | **IEEE Paper Template** | Conference research publication | `container`, `table table-sm table-bordered`, `text-center`, `shadow-sm` | Times New Roman typography rules, IEEE two-column flow (`column-count: 2`), paragraph text-indent | [Task 4 - IEEE Paper](./Task%204%20-%20IEEE%20Paper/) |
| 5 | **Netflix Landing Page** | Custom UI with video & media | `container`, alternating rows (`row`, `flex-md-row-reverse`), `form-control form-control-lg`, `btn-danger btn-lg` | Hero background with dark gradient, TV screen video coordinates (`object-fit: cover`) | [Task 5 - CustomUI](./Task%205%20-%20CustomUI/) |

---

## Key Fixes Applied to CustomUI (Netflix)

1. **Hero Input & Button:**
   - Replaced fixed CSS padding (`7px 101px 8px 14px`) and arbitrary widths with Bootstrap's `.form-control.form-control-lg` and `.btn.btn-danger.btn-lg`.
   - Wrapped the form in a responsive flexbox container (`d-flex flex-column flex-md-row gap-2`) with `max-width: 620px` to ensure the input field and button have matching 48px heights, crisp borders, and clean stacking on mobile.
2. **TV Mockup Video Overflow & Formatting:**
   - Replaced the fixed `width: 555px; top: 51px; right: 0;` CSS with mathematically exact relative coordinates:
     - `top: 20.8%`
     - `left: 13.1%`
     - `width: 72.8%`
     - `height: 54.6%`
   - Added `overflow: hidden` and `object-fit: cover` to `.tv-video-container video`.
   - The video now sits with pixel-perfect precision inside the transparent bezel cutout of `tv.png` on both the "Enjoy on your TV" and "Watch everywhere" sections across all viewport widths.

---

## How to Run

1. Navigate to any task directory inside `Lab 3/Task 1/`.
2. Open `index.html` directly in any web browser.
3. All dependencies (Bootstrap 5.3 CDN, Google Fonts) load automatically over CDN. No local build or server required.
