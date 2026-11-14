// Lab 8: Automated Integration Tests for NestJS E-Commerce Backend (ETHNC Replica)
// Uses Node.js native test runner: node --test test/api.test.js

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

let app;
let base;

before(async () => {
  app = await NestFactory.create(AppModule, { logger: false });
  await app.listen(0, '127.0.0.1');
  const server = app.getHttpServer();
  const address = server.address();
  base = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (app) {
    await app.close();
  }
});

const req = (pathName, method = 'GET', data) =>
  fetch(base + pathName, {
    method,
    headers: data === undefined ? {} : { 'Content-Type': 'application/json' },
    body: data === undefined ? undefined : JSON.stringify(data),
  });

test('1. GET /health returns status ok', async () => {
  const res = await req('/health');
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'ok');
});

test('2. GET / returns application info and endpoint manifest', async () => {
  const res = await req('/');
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'online');
  assert.ok(data.endpoints);
});

test('3. GET /products returns the 8 seeded Pakistani couture products', async () => {
  const res = await req('/products');
  assert.equal(res.status, 200);
  const products = await res.json();
  assert.equal(Array.isArray(products), true);
  assert.equal(products.length, 8);
  assert.equal(products[0].name, 'Embroidered Suit');
});

test('4. GET /products?category=Unstitched filters catalog', async () => {
  const res = await req('/products?category=Unstitched');
  assert.equal(res.status, 200);
  const products = await res.json();
  assert.equal(products.length, 1);
  assert.equal(products[0].name, 'Unstitched Lawn 3-Piece');
});

test('5. GET /products/1 retrieves single product details with reviews', async () => {
  const res = await req('/products/1');
  assert.equal(res.status, 200);
  const product = await res.json();
  assert.equal(product.id, 1);
  assert.equal(product.price, 2990);
  assert.ok(Array.isArray(product.reviews));
});

test('6. POST /products/1/reviews adds a customer review', async () => {
  const res = await req('/products/1/reviews', 'POST', {
    reviewerName: 'Sana Tariq',
    rating: 5,
    comment: 'The chiffon dupatta and embroidery exceeded expectations!'
  });
  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.review.reviewerName, 'Sana Tariq');
});

test('7. POST /users/signup registers a new customer', async () => {
  const res = await req('/users/signup', 'POST', {
    name: 'Hamza Malik',
    email: 'hamza@example.com',
    phone: '+92 333 9876543',
    password: 'Password999!',
    city: 'Lahore',
    province: 'Punjab'
  });
  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.user.email, 'hamza@example.com');
  assert.equal(body.user.password, undefined); // ensures password is not leaked
});

test('8. POST /users/signup rejects duplicate email with 409 Conflict', async () => {
  const res = await req('/users/signup', 'POST', {
    name: 'Duplicate Hamza',
    email: 'hamza@example.com',
    password: 'Password999!'
  });
  assert.equal(res.status, 409);
});

test('9. POST /users/login logs in with valid credentials', async () => {
  const res = await req('/users/login', 'POST', {
    email: 'hamza@example.com',
    password: 'Password999!'
  });
  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.user.name, 'Hamza Malik');
});

test('10. POST /users/login rejects incorrect password with 400 Bad Request', async () => {
  const res = await req('/users/login', 'POST', {
    email: 'hamza@example.com',
    password: 'WrongPassword'
  });
  assert.equal(res.status, 400);
});

test('11. GET /cart/1 returns empty cart initially', async () => {
  const res = await req('/cart/1');
  assert.equal(res.status, 200);
  const cart = await res.json();
  assert.equal(cart.userId, 1);
  assert.equal(cart.items.length, 0);
  assert.equal(cart.total, 0);
});

test('12. POST /cart/1 adds product variant to shopping cart', async () => {
  const res = await req('/cart/1', 'POST', {
    productId: 1, // Embroidered Suit (PKR 2990)
    quantity: 2,
    size: 'M',
    color: 'Maroon'
  });
  assert.equal(res.status, 201);
  const cart = await res.json();
  assert.equal(cart.items.length, 1);
  assert.equal(cart.items[0].quantity, 2);
  assert.equal(cart.items[0].price, 2990);
  assert.equal(cart.subtotal, 5980);
  // Free shipping since subtotal >= 5000:
  assert.equal(cart.shippingFee, 0);
  assert.equal(cart.total, 5980);
});

test('13. POST /cart/1/coupon applies promo code ETHNC10 (10% off)', async () => {
  const res = await req('/cart/1/coupon', 'POST', {
    code: 'ETHNC10'
  });
  assert.equal(res.status, 201);
  const cart = await res.json();
  assert.equal(cart.couponCode, 'ETHNC10');
  assert.equal(cart.discountPercentage, 10);
  assert.equal(cart.discountAmount, 598);
  assert.equal(cart.total, 5382);
});

test('14. PATCH /cart/1 adjusts item quantity', async () => {
  const res = await req('/cart/1', 'PATCH', {
    productId: 1,
    quantity: 1
  });
  assert.equal(res.status, 200);
  const cart = await res.json();
  assert.equal(cart.items[0].quantity, 1);
  assert.equal(cart.subtotal, 2990);
  // Now discounted subtotal < 5000 -> shipping is PKR 250
  assert.equal(cart.shippingFee, 250);
});

test('15. POST /orders creates order from user cart, deducts stock and clears cart', async () => {
  // First get current product stock
  const prodBefore = await (await req('/products/1')).json();
  const stockBefore = prodBefore.stock;

  const res = await req('/orders', 'POST', {
    userId: 1,
    shippingAddress: {
      fullName: 'Nawal Fateh',
      phone: '+92 300 1234567',
      address: 'House 42, Street 5, Sector F-8/2',
      city: 'Islamabad',
      province: 'Federal Capital',
      postalCode: '44000'
    },
    paymentMethod: 'Cash on Delivery (COD)'
  });
  assert.equal(res.status, 201);
  const order = await res.json();
  assert.equal(order.userId, 1);
  assert.ok(order.orderNumber.startsWith('ETH-'));
  assert.equal(order.status, 'Confirmed');
  assert.equal(order.items.length, 1);

  // Check product stock decremented
  const prodAfter = await (await req('/products/1')).json();
  assert.equal(prodAfter.stock, stockBefore - 1);

  // Check cart cleared
  const cartAfter = await (await req('/cart/1')).json();
  assert.equal(cartAfter.items.length, 0);
});

test('16. GET /orders/1 retrieves order receipt', async () => {
  const res = await req('/orders/1');
  assert.equal(res.status, 200);
  const order = await res.json();
  assert.equal(order.id, 1);
  assert.equal(order.paymentMethod, 'Cash on Delivery (COD)');
});

test('17. PATCH /orders/1/status advances tracking status', async () => {
  const res = await req('/orders/1/status', 'PATCH', {
    status: 'Shipped'
  });
  assert.equal(res.status, 200);
  const order = await res.json();
  assert.equal(order.status, 'Shipped');
});

test('18. DELETE /orders/1 cancels order and restores inventory', async () => {
  const prodBefore = await (await req('/products/1')).json();
  const stockBefore = prodBefore.stock;

  const res = await req('/orders/1', 'DELETE');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.order.status, 'Cancelled');

  const prodAfter = await (await req('/products/1')).json();
  assert.equal(prodAfter.stock, stockBefore + 1);
});
