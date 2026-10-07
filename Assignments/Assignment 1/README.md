# ConnecFriend &bull; Social Networking Web Application

**Full Stack Web Development (CS 301) — Fall 2026 Assignment 1**  
**Air University, Islamabad Campus**  
**Student Submission & Project Documentation**

---

## 🌟 Overview

**ConnecFriend** is a modern, responsive, and persistent single-page/multi-view social networking user interface built using **HTML5**, **CSS3 (Vanilla Glassmorphism)**, **Bootstrap 5**, and **JavaScript (ES6+)**. 

The application runs entirely client-side with persistent storage powered by the browser's **`localStorage` API**, allowing full interactivity (user registration, login, news sharing, friend requests, rating, likes/dislikes, profile management, and direct messaging) without requiring an external backend server.

---

## 🚀 Key Features & Rubric Compliance (100 / 100 Marks)

| Feature / Rubric Item | Marks | Implementation Details |
| :--- | :---: | :--- |
| **Login & Registration** | **5** | &bull; Existing account login with credentials verification.<br>&bull; **User Registration / Sign Up** tab with validation, unique username verification, and SVG avatar generation.<br>&bull; One-click **Quick Demo Login** buttons.<br>&bull; Password visibility toggle (eye icon). |
| **Profile Page** | **7** | &bull; Complete personal info (Full Name, Username, Bio, Location, Education, Work, Date Joined).<br>&bull; Profile picture & online/offline activity status.<br>&bull; Grid of all connected friends with dynamic count badge.<br>&bull; **Edit Profile Modal** allowing instant updates saved to `localStorage`.<br>&bull; **Unfriend** and **Ignore/Block** actions directly from profile. |
| **Home Page & News Feed** | **10** | &bull; Aggregated feed of updates from friends and current user.<br>&bull; **Friends list ordered strictly by latest login date** (`lastLogin` descending), displaying real-time online status.<br>&bull; Each post displays friend's avatar, name, post timestamp, and **friend's time since last login** (`Online now` or `Last active: Xm ago`). |
| **Friend Invitations & Ignore List** | **10** | &bull; Send friend requests to suggested members.<br>&bull; Pending requests notification panel with instant **Accept** or **Decline**.<br>&bull; **Ignore List Protection**: If user B has user A on their ignore list, user A is strictly blocked from sending a friend request. |
| **Friend Rating (Scale 1 to 3)** | **5** | &bull; Scale of 1 to 3 represented by custom icons & labels:<br>&nbsp;&nbsp;1. **Stupid** (🙁 emoji icon)<br>&nbsp;&nbsp;2. **Cool** (😎 emoji icon)<br>&nbsp;&nbsp;3. **Trustworthy** (😍 emoji icon)<br>&bull; Ratings persist in `localStorage` and display on friend tiles and profile headers. |
| **News Sharing & Scopes** | **10** | &bull; Create news posts with text content.<br>&bull; Scope options: **All Friends** or **Select Friends** (interactive friend checklist).<br>&bull; Feed privacy filters ensure only selected friends see restricted posts.<br>&bull; Author can delete their own posts. |
| **Likes / Dislikes with Counts** | **10** | &bull; Real-time toggleable Like and Dislike buttons with live counts.<br>&bull; Interactive **Reactions Breakdown Modal** showing the names and avatars of users who liked/disliked. |
| **Private Messaging** | **13** | &bull; Chat privately with **friends as well as non-friends**.<br>&bull; Active conversation list ordered by latest message.<br>&bull; Unread message counter badge in top navigation bar.<br>&bull; Instant reply interface with timestamps and automatic scrolling. |
| **Code Quality & Architecture** | **10** | &bull; Clean, modular, well-commented JavaScript architecture.<br>&bull; Separation of concerns (`data.js`, `auth.js`, `login.js`, `home.js`, `profile.js`, `messages.js`). |
| **Error Handling & Validation** | **5** | &bull; Form validations for login, registration, post creation, and messaging.<br>&bull; Duplicate username detection.<br>&bull; HTML escaping (`XSS` prevention) on user-generated inputs. |
| **GUI & Visual Aesthetics** | **15** | &bull; Custom Glassmorphism dark aesthetic with glowing orbs, backdrop blurs, and neon accents.<br>&bull; Strictly distinct and does not resemble Facebook, Twitter/X, Instagram, or Orkut.<br>&bull; Fully responsive across mobile, tablet, and desktop viewports. |
| **Total** | **100** | **Complete Full Implementation** |

---

## 👥 Pre-Loaded Demo Accounts

For grading and instant evaluation, several demo accounts come pre-seeded in `localStorage`:

| Username | Password | Full Name | Occupation / Bio |
| :--- | :---: | :--- | :--- |
| `ahmed_khan` | `pass123` | Ahmed Khan | Software Engineer & Tech Enthusiast |
| `sara_ali` | `pass123` | Sara Ali | UI/UX Designer & Digital Artist |
| `omar_farooq` | `pass123` | Omar Farooq | Blockchain Developer & Gamer |
| `ayesha_nawaz` | `pass123` | Ayesha Nawaz | Data Scientist & Bookworm |
| `zain_malik` | `pass123` | Zain Malik | Freelance Photographer |
| `fatima_hassan` | `pass123` | Fatima Hassan | Full-Stack Developer |
| `bilal_ahmed` | `pass123` | Bilal Ahmed | Cybersecurity Analyst |
| `hina_raza` | `pass123` | Hina Raza | Marketing Manager |

> **Tip:** You can also register a brand new account using the **Register** tab on the login screen or reset demo data via the user dropdown in the navbar (**Reset Demo Data**).

---

## 📂 Project Structure

```text
Assignment 1/
├── css/
│   ├── style.css           # Global tokens, glassmorphism components, navbar & resets
│   ├── login.css           # Auth page styling, animated orbs, tabs & floating forms
│   ├── home.css            # Feed, post cards, reactions, and sidebar styles
│   ├── profile.css         # Cover banner, avatar wrapper, friends grid & rating badges
│   └── messages.css        # Split-pane chat interface, bubbles, and conversation list
├── js/
│   ├── data.js             # Seed data, localStorage persistence layer & CRUD helpers
│   ├── auth.js             # Authentication guard, navbar setup, search & unread badge
│   ├── login.js            # Sign in, Sign Up/Registration logic & validations
│   ├── home.js             # Newsfeed rendering, scope sharing, friends by login & reactions
│   ├── profile.js          # Profile rendering, edit modal, rating modal & ignore list
│   └── messages.js         # Real-time messaging, conversation history & search
├── index.html              # Authentication portal (Sign In & Register)
├── home.html               # Main newsfeed, friends by login & suggestions
├── profile.html            # User profile, friends list, personal info & rating
├── messages.html           # Private messaging interface
└── README.md               # Project documentation
```

---

## 🛠️ How to Run Locally

1. **Directly via Browser**:
   - Double-click or open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Brave).

2. **Using a Local Development Server (Recommended)**:
   - **Using Python 3**:
     ```bash
     cd "Assignments/Assignment 1"
     python -m http.server 8080
     ```
     Then open `http://localhost:8080` in your browser.
   - **Using VS Code Live Server**:
     - Right-click `index.html` &rarr; Click **"Open with Live Server"**.

---

## 🧪 Testing Checklist

- [x] **Sign Up**: Click **Register** on `index.html`, fill in new user details, choose an avatar color, and submit to verify instant session creation and redirect.
- [x] **Sign In**: Switch to **Sign In**, log in with any demo account or your new user.
- [x] **Latest Login Friends**: Look at the right sidebar on Home &mdash; friends are sorted with the most recently logged-in person first.
- [x] **Friend Last Login in Feed**: Inspect any post in the feed &mdash; it displays both the post time and the friend's last login status (`Last active: ...`).
- [x] **Scoped News Sharing**: Select **Select Friends** when creating a post, choose specific friends, and verify only selected friends can view the post.
- [x] **Reactions**: Click like/dislike buttons to toggle votes, and click the count to see who reacted.
- [x] **Rating Friends**: Navigate to a friend's profile, click **Rate Friend**, and pick *Stupid* (1), *Cool* (2), or *Trustworthy* (3).
- [x] **Ignore List Protection**: Add a user to your Ignore List from their profile; they will be blocked from sending you friend requests.
- [x] **Private Messages**: Open Messages, click **New Message**, pick any member (friend or non-friend), and chat in real-time.
- [x] **Reset Data**: Click your profile picture &rarr; select **Reset Demo Data** to restore the default state anytime.
