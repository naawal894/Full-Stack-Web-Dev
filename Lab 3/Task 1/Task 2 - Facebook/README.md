# Task 2 — Facebook Homepage

Replica of the **Facebook news feed homepage** (post-login view) using HTML & CSS only.

## Features

- **Top Navigation Bar** — Facebook logo, search bar, navigation tabs (Home, Video, Marketplace, Groups, Gaming), messenger/notification icons with badges, profile avatar
- **Left Sidebar** — Profile link, shortcuts (Friends, Memories, Saved, Groups, etc.), footer links
- **Center Feed** — Stories row, create post box, multiple post cards with author info, text, images, like/comment/share actions
- **Right Sidebar** — Sponsored ads, contacts list with online indicators
- Fully responsive — sidebars collapse on smaller screens
- Modern light theme matching current Facebook design language

## Files

| File | Purpose |
|------|---------|
| `index.html` | Full page structure — navbar, 3-column layout, posts |
| `style.css` | Facebook-accurate colors, card shadows, hover states |

## Layout

```
┌─────────────────────────────────────────────┐
│                  NAVBAR                      │
├──────────┬──────────────────┬───────────────┤
│  Left    │   Center Feed    │    Right      │
│ Sidebar  │  (Stories/Posts)  │   Sidebar     │
│          │                  │  (Contacts)   │
└──────────┴──────────────────┴───────────────┘
```
