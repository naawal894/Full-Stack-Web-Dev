# Lab 6 - Asynchronous JavaScript and Promises

## Overview
This lab covers asynchronous JavaScript using `async/await`, `fetch`, and `Promise.all()`.

## Tasks

### Task 1 (`task1.js`)
- Implements an async function `fetchUser(userId)` that fetches a user object from a dummy API (`jsonplaceholder.typicode.com`).
- Returns the user object on success and returns an error message if the fetch is unsuccessful (e.g., status 404).

### Task 2 (`task2.js`)
- Runs two asynchronous operations concurrently (`fetchUser` and `fetchPosts`) using `Promise.all()`.
- Validates the results returned by both operations.
- Rejects the main promise if either operation returns invalid data (e.g. invalid user or missing posts), or resolves with both results if valid.

## How to Run

```bash
node task1.js
node task2.js
```
