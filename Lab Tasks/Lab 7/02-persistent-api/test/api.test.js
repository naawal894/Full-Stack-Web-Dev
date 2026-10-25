// Lab 7 – Task 2: Automated Integration Tests for E-Commerce Persistent API
// Uses Node.js native test runner: node --test test/api.test.js

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { createApp } = require('../app.js');

let server;
let base;
let tempDir;

before(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ethnc-ecom-test-'));
  server = createApp(tempDir);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await fs.rm(tempDir, { recursive: true, force: true });
});

const req = (pathName, method = 'GET', data) =>
  fetch(base + pathName, {
    method,
    headers: data === undefined ? {} : { 'Content-Type': 'application/json' },
    body: data === undefined ? undefined : JSON.stringify(data),
  });

test('GET /health returns status ok', async () => {
  const res = await req('/health');
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok' });
});

test('POST /users registers a new customer', async () => {
  const res = await req('/users', 'POST', {
    name: 'Nawal Fateh',
    email: 'nawal@example.com',
    password: 'secretPassword123',
    phone: '03001234567',
  });
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.id, 1);
  assert.equal(data.name, 'Nawal Fateh');
  assert.equal(data.email, 'nawal@example.com');
});

test('POST /users rejects duplicate email', async () => {
  const res = await req('/users', 'POST', {
    name: 'Another User',
    email: 'nawal@example.com',
    password: 'password999',
  });
  assert.equal(res.status, 409);
  const data = await res.json();
  assert.match(data.error, /already registered/i);
});

test('POST /products adds a catalog item', async () => {
  const res = await req('/products', 'POST', {
    name: 'Silk Embroidered Shawl',
    category: 'Accessories',
    price: 3500,
    originalPrice: 5000,
    stock: 15,
  });
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.id, 1);
  assert.equal(data.name, 'Silk Embroidered Shawl');
  assert.equal(data.price, 3500);
});

test('GET /products lists catalog items', async () => {
  const res = await req('/products');
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(Array.isArray(data), true);
  assert.equal(data.length, 1);
});

test('GET /cart/1 initially returns empty items', async () => {
  const res = await req('/cart/1');
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.deepEqual(data.items, []);
});

test('POST /cart/1 adds item to cart', async () => {
  const res = await req('/cart/1', 'POST', {
    productId: 1,
    quantity: 2,
    size: 'Standard',
    color: 'Crimson',
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.userId, 1);
  assert.equal(data.items.length, 1);
  assert.equal(data.items[0].quantity, 2);
  assert.equal(data.items[0].price, 3500);
});

test('PATCH /cart/1 updates item quantity', async () => {
  const res = await req('/cart/1', 'PATCH', {
    productId: 1,
    quantity: 3,
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.items[0].quantity, 3);
});

test('POST /orders creates order from user cart and clears cart', async () => {
  const res = await req('/orders', 'POST', {
    userId: 1,
    shippingAddress: {
      address: 'House 14, Street 9, F-8/2',
      city: 'Islamabad',
      province: 'Islamabad Capital Territory',
      phone: '03001234567',
    },
    paymentMethod: 'Cash on Delivery',
  });
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.id, 1);
  assert.equal(data.userId, 1);
  assert.equal(data.status, 'Confirmed');
  assert.equal(data.items.length, 1);
  assert.equal(data.subtotal, 10500); // 3 * 3500
  assert.equal(data.shipping, 0); // Free shipping over 5000

  // Verify cart is now empty
  const cartRes = await req('/cart/1');
  const cartData = await cartRes.json();
  assert.deepEqual(cartData.items, []);
});

test('GET /orders/user/1 returns orders for user', async () => {
  const res = await req('/orders/user/1');
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.length, 1);
  assert.equal(data[0].id, 1);
});

test('PATCH /orders/1 updates order tracking status', async () => {
  const res = await req('/orders/1', 'PATCH', { status: 'Shipped' });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'Shipped');
});

test('DELETE /orders/1 cancels active order', async () => {
  const res = await req('/orders/1', 'DELETE');
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'Cancelled');
});
