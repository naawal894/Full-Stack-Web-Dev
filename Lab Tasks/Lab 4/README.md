# Lab 4 — Fundamentals of JavaScript

**Course:** Full Stack Web Development (CS-301L)  
**Student:** Nawal Fateh  
**University:** Air University, Islamabad  
**Semester:** 5th (Fall 2026)  
**Section:** BSCS-V-B (Shift-I)  
**Competencies:** CLO-1 &bull; GA-4  

---

## Lab Objectives

The objective of Lab 4 is to build a solid foundation in core JavaScript programming, covering:
1. **Variables & Primitive Types:** Strings, numbers, booleans, and string concatenation.
2. **Objects & Nested Structures:** Structuring and querying complex nested data with object literals.
3. **Control Flow & Algorithms:** Loops, conditionals, prime number detection, and numerical algorithms.
4. **Array Operations & String Formatting:** Joining, slicing, and formatting numeric arrays into formatted strings.
5. **Higher-Order Functions & Rest Parameters:** Variadic functions (`...args`) and functional mapping.
6. **Mathematical Transformations:** Dynamically applying mathematical operations across variable argument lists.

---

## Tasks Summary

| # | Task | File | Description | Key JavaScript Features |
|---|------|------|-------------|-------------------------|
| **1** | **Biography & Profile Objects** | [`Task 1.js`](./Task%201.js) | Personal introduction and structured nested profile object (name, age, email, address, degree). | Variables, primitive types, object literals, nested objects, property access. |
| **2** | **Prime Number Generator** | [`Task 2.js`](./Task%202.js) | Determines whether a number is prime and finds the next sequential prime. | `isPrime()`, `nextPrime()`, `for` loop optimization ($O(\sqrt{n})$), `while` loop. |
| **3** | **Phone Number Formatter** | [`Task 3.js`](./Task%203.js) | Formats an array of 10 integers (0–9) into standard format `(XXX) XXX-XXXX`. | Array methods (`join()`), string slicing (`slice()`), string concatenation. |
| **4** | **Higher-Order Rounding Function** | [`Task 4.js`](./Task%204.js) | General-purpose wrapper applying `Math.round` to 0, 1, or multiple arguments. | Rest parameters (`...args`), higher-order functions (`applyToArgs`), `map()`. |
| **5** | **Variadic Math Utilities** | [`Task 5.js`](./Task%205.js) | Implements variadic wrappers for `Math.abs`, `Math.ceil`, and `Math.floor`. | Reusable higher-order utility, rest parameters, array mapping. |
| **6** | **Sum of Multiples** | [`Task 6.js`](./Task%206.js) | Calculates the sum of all natural numbers below $z$ that are multiples of $x$ or $y$. | Modulo arithmetic (`%`), logical OR (`\|\|`), accumulator loop. |

---

## How to Run

All tasks run natively in Node.js without any dependencies:

```bash
# Navigate to Lab 4 directory
cd "Lab Tasks/Lab 4"

# Run any individual task
node "Task 1.js"
node "Task 2.js"
node "Task 3.js"
node "Task 4.js"
node "Task 5.js"
node "Task 6.js"

# Run all tasks together
node "Task 1.js" && node "Task 2.js" && node "Task 3.js" && node "Task 4.js" && node "Task 5.js" && node "Task 6.js"
```

---

## Technologies Used

- **Runtime:** Node.js (v24.x) / Modern ECMAScript (ES6+)
- **Paradigm:** Procedural & Functional Programming
- **Core Concepts:** Variadic arguments, higher-order functions, array/string manipulation, object structures.
