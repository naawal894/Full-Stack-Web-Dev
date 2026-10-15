# Lab 5 — Hands on Practice on Advanced JavaScript (CampusFlow)

**Course:** Full Stack Web Development (CS-301L)  
**Student:** Nawal Fateh  
**University:** Air University, Islamabad  
**Semester:** 5th (Fall 2026)  
**Section:** BSCS-V-B (Shift-I)  
**Competencies:** CLO-1 &bull; GA-4  

---

## Case Study: CampusFlow Academic Operations System

Air University is developing **CampusFlow**, a JavaScript-based academic operations system. The core business logic is implemented and tested in pure Node.js before being connected to any web interface. The system receives imperfect student data, performs academic analytics, manages user hierarchies, validates JSON transcript data, and communicates with asynchronous callback and promise-based registration and dashboard services.

---

## General Constraints & Requirements

- **Pure Node.js Environment:** No DOM, HTML, React, Express, external npm packages, or databases.
- **No Closure-Based State Retention:** Functions do not return inner functions to retain state.
- **Proper Variable Scoping:** Exclusively `const` and `let` (`var` avoided).
- **Immutability First:** Source data is never mutated; new objects and arrays are created via spread/functional patterns.
- **Return Values:** Functions return meaningful results rather than merely logging outputs.
- **Strict Equality:** Strict operators (`===` / `!==`) used throughout.
- **Modular Architecture:** Organized into native ES Modules (`"type": "module"` in `package.json`).
- **Comprehensive Testing:** Normal, boundary, and error cases demonstrated across all tasks.

---

## Tasks Overview

| # | Task | Folder / File | Description | Core JavaScript Concepts | Marks |
|---|------|---------------|-------------|--------------------------|-------|
| **1** | **Admission Decision & Sanitization Engine** | [`task1/admissions.js`](./task1/admissions.js) | Cleans raw form string inputs, handles `NaN`, checks ranges, calculates merit (20/30/50), determines admission status (`SELECTED`, `WAITING`, `REJECTED`, `INVALID DATA`), and generates summary statistics. | Explicit type casting, truthy/falsy, guard clauses, arithmetic & logical operators. | — |
| **2** | **Academic Performance Intelligence Engine** | [`task2/performance.js`](./task2/performance.js) | Evaluates letter grades and grade points, produces immutable ranked merit lists, computes dynamic departmental statistics (tested with unknown 'DS' dept), and runs academic queries. | Higher-order array methods (`map`, `filter`, `find`, `findIndex`, `reduce`, `some`, `every`, `sort`, `slice`). | — |
| **3** | **Safe Student Profile Update Service** | [`task3/profileUpdate.js`](./task3/profileUpdate.js) | Safely updates nested student profiles without mutating the original, preserving falsy values (`0`, `false`). Includes the reference equality challenge with full explanations. | Object/nested destructuring, renaming, defaults, rest/spread, `?.`, `??`, property shorthand. | — |
| **4** | **University User Hierarchy & Dynamic `this`** | [`task4/hierarchy.js`](./task4/hierarchy.js) | Builds `Person` -> `Student` & `FacultyMember` hierarchy with method overriding and runtime polymorphism. Demonstrates `.call()`, `.bind()`, and explains detached methods losing `this` in strict mode. | Classes, `constructor`, `new`, `this`, `extends`, `super`, method overriding, `instanceof`, `call()`, `bind()`. | — |
| **5** | **Modular Transcript Processing & JSON** | [`task5/`](./task5/) | Modular transcript processor separated into 4 files (`Student.js`, `gradeUtils.js`, `transcriptService.js`, `main.js`). Safe JSON parsing, schema checks throwing `TypeError`, `RangeError`, and `SyntaxError` in `try/catch/finally`. | ES Modules (default & named exports, aliased imports `as`), custom error handling. | — |
| **6** | **Legacy Registration Service (Callbacks)** | [`task6/callbackRegistration.js`](./task6/callbackRegistration.js) | 4-step sequential registration using `setTimeout` and error-first callbacks (`callback(err, data)`). Immediately halts on failure and documents the architectural perils of callback hell. | Asynchronous callbacks, error-first convention, asynchronous boundary handling. | — |
| **7** | **Promise-Based Multi-Service Engine** | [`task7/promiseRegistration.js`](./task7/promiseRegistration.js) | Modernized registration engine with a 5-step Promise chain (Part A), concurrent notification status checks via `Promise.allSettled()` (Part B), and redundant server selection via `Promise.any()` with justification (Part C). | `new Promise`, `resolve`, `reject`, `.then()`, `.catch()`, `.finally()`, `Promise.allSettled()`, `Promise.any()`. | 12 |
| **8** | **Concurrent Academic API Aggregator** | [`task8/asyncDashboard.js`](./task8/asyncDashboard.js) | Aggregates dashboard metrics concurrently from 3 endpoints using `Promise.all()`. Includes full `fakeFetch()` simulation and `fetchWithTimeout()` using `AbortController` and `try/finally`. | `async/await`, `fakeFetch`, `response.ok`, concurrent `Promise.all()`, `AbortController`, timeout cleanup. | 12 |

---

## Directory Layout

```
Lab Tasks/Lab 5/
├── package.json
├── README.md
├── task1/
│   └── admissions.js           # Task 1
├── task2/
│   └── performance.js          # Task 2
├── task3/
│   └── profileUpdate.js        # Task 3
├── task4/
│   └── hierarchy.js            # Task 4
├── task5/                      # Task 5 (Modular architecture)
│   ├── Student.js              # Default export of Student class
│   ├── gradeUtils.js           # Named exports for grade/GPA calculations
│   ├── transcriptService.js    # JSON validation, error handling, reporting
│   └── main.js                 # Entry module with imports & try/catch/finally
├── task6/
│   └── callbackRegistration.js # Task 6
├── task7/
│   └── promiseRegistration.js  # Task 7 (12 Marks)
└── task8/
    └── asyncDashboard.js       # Task 8 (12 Marks)
```

---

## How to Run

Navigate to the `Lab Tasks/Lab 5` folder in your terminal:

```bash
cd "Lab Tasks/Lab 5"
```

### Run All Tasks Simultaneously
```bash
npm test
# or
npm run test-all
```

### Run Individual Tasks
```bash
npm run task1   # Task 1: Admission Decision Engine
npm run task2   # Task 2: Academic Performance Intelligence
npm run task3   # Task 3: Safe Profile Update Service
npm run task4   # Task 4: User Hierarchy & Dynamic this
npm run task5   # Task 5: Modular Transcript Processing
npm run task6   # Task 6: Legacy Callback Registration
npm run task7   # Task 7: Promise Registration & Combinators
npm run task8   # Task 8: Async/Await Concurrent Dashboard
```

---

## Technologies Used

- **Environment:** Node.js (v24.x)
- **Module System:** ECMAScript Modules (ESM)
- **Language Standards:** ECMAScript 2022+ (Classes, async/await, optional chaining `?.`, nullish coalescing `??`, `Promise.allSettled`, `Promise.any`, `AbortController`)
