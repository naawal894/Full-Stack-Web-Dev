// Lab 7 – Task 2: E-Commerce Store – Persistent REST API
// Endpoints for: Users, Products, Cart, Orders
// Data persisted to JSON files in ./data/ directory.
// Based on ETHNC E-Commerce Store (Lab 3 Task 2).

const http = require('node:http');
const path = require('node:path');
const { EventEmitter } = require('node:events');
const { HttpError, positiveId, requireFields, trimStrings } = require('./validate.js');
const { createStore } = require('./store.js');

function createApp(dataDir) {
  // ─── Stores ─────────────────────────────────────────────────────────────
  const userStore     = createStore(path.join(dataDir, 'users.json'));
  const productStore  = createStore(path.join(dataDir, 'products.json'));
  const cartStore     = createStore(path.join(dataDir, 'carts.json'));
  const orderStore    = createStore(path.join(dataDir, 'orders.json'));

  // ─── Events ─────────────────────────────────────────────────────────────
  const events = new EventEmitter();
  events.on('orderPlaced', (order) => console.log(`[event] Order #${order.id} placed by user ${order.userId}`));
  events.on('productCreated', (product) => console.log(`[event] Product "${product.name}" created (id ${product.id})`));

  // ─── Helpers ────────────────────────────────────────────────────────────
  function json(res, status, value) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(value));
  }

  async function body(req) {
    if (!String(req.headers['content-type'] || '').toLowerCase().includes('application/json')) {
      throw new HttpError(415, 'Content-Type must be application/json');
    }
    let raw = '';
    for await (const chunk of req) {
      raw += chunk.toString('utf8');
      if (Buffer.byteLength(raw) > 65536) throw new HttpError(413, 'Request body too large');
    }
    try { return JSON.parse(raw); }
    catch { throw new HttpError(400, 'Malformed JSON'); }
  }

  function nextId(records) {
    return records.reduce((max, r) => Math.max(max, r.id), 0) + 1;
  }

  // ─── Route matching helpers ─────────────────────────────────────────────
  function matchCollection(url, base) { return url.pathname === base; }
  function matchMember(url, base) {
    const m = new RegExp(`^${base}/([^/]+)$`).exec(url.pathname);
    return m ? positiveId(m[1]) : null;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  USERS  –  POST /users (register)  |  GET /users  |  GET /users/:id
  //            PUT /users/:id  |  PATCH /users/:id  |  DELETE /users/:id
  // ═══════════════════════════════════════════════════════════════════════

  async function handleUsers(req, url) {
    const isCol = matchCollection(url, '/users');
    const id = matchMember(url, '/users');
    if (!isCol && id === null) return false;

    if (isCol && req.method === 'GET') {
      json(res_placeholder, 200, await userStore.list());
      return true; // placeholder; actual res passed below
    }

    // handled below in the server callback for proper `res` reference
    return 'users';
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  SERVER
  // ═══════════════════════════════════════════════════════════════════════

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');

      // ── Health ──────────────────────────────────────────────────────────
      if (req.method === 'GET' && url.pathname === '/health') {
        return json(res, 200, { status: 'ok' });
      }

      // ══════════════════════════════════════════════════════════════════
      //  USERS
      // ══════════════════════════════════════════════════════════════════
      const usersCol = matchCollection(url, '/users');
      const userId   = matchMember(url, '/users');

      if (usersCol && req.method === 'GET') {
        return json(res, 200, await userStore.list());
      }
      if (usersCol && req.method === 'POST') {
        const data = await body(req);
        requireFields(data, ['name', 'email', 'password']);
        const created = await userStore.edit((users) => {
          // Check for duplicate email
          if (users.some((u) => u.email === data.email.trim())) {
            throw new HttpError(409, 'Email already registered');
          }
          const user = { id: nextId(users), ...trimStrings(data), createdAt: new Date().toISOString() };
          users.push(user);
          return { changed: true, value: user };
        });
        return json(res, 201, created);
      }
      if (userId !== null && req.method === 'GET') {
        const found = (await userStore.list()).find((u) => u.id === userId);
        if (!found) throw new HttpError(404, 'User not found');
        return json(res, 200, found);
      }
      if (userId !== null && (req.method === 'PUT' || req.method === 'PATCH')) {
        const data = await body(req);
        if (req.method === 'PUT') requireFields(data, ['name', 'email']);
        else requireFields(data, [], true);
        const updated = await userStore.edit((users) => {
          const found = users.find((u) => u.id === userId);
          if (!found) throw new HttpError(404, 'User not found');
          Object.assign(found, trimStrings(data));
          return { changed: true, value: { ...found } };
        });
        return json(res, 200, updated);
      }
      if (userId !== null && req.method === 'DELETE') {
        await userStore.edit((users) => {
          const idx = users.findIndex((u) => u.id === userId);
          if (idx < 0) throw new HttpError(404, 'User not found');
          users.splice(idx, 1);
          return { changed: true, value: null };
        });
        res.writeHead(204);
        return res.end();
      }

      // ══════════════════════════════════════════════════════════════════
      //  PRODUCTS
      // ══════════════════════════════════════════════════════════════════
      const productsCol = matchCollection(url, '/products');
      const productId   = matchMember(url, '/products');

      if (productsCol && req.method === 'GET') {
        const products = await productStore.list();
        // Optional query filtering by category
        const category = url.searchParams.get('category');
        if (category) {
          return json(res, 200, products.filter((p) => p.category === category));
        }
        return json(res, 200, products);
      }
      if (productsCol && req.method === 'POST') {
        const data = await body(req);
        requireFields(data, ['name', 'price', 'category']);
        const created = await productStore.edit((products) => {
          const product = {
            id: nextId(products),
            ...trimStrings(data),
            price: Number(data.price),
            originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
            stock: data.stock !== undefined ? Number(data.stock) : 0,
            createdAt: new Date().toISOString(),
          };
          products.push(product);
          return { changed: true, value: product };
        });
        events.emit('productCreated', created);
        return json(res, 201, created);
      }
      if (productId !== null && req.method === 'GET') {
        const found = (await productStore.list()).find((p) => p.id === productId);
        if (!found) throw new HttpError(404, 'Product not found');
        return json(res, 200, found);
      }
      if (productId !== null && (req.method === 'PUT' || req.method === 'PATCH')) {
        const data = await body(req);
        if (req.method === 'PUT') requireFields(data, ['name', 'price', 'category']);
        else requireFields(data, [], true);
        const updated = await productStore.edit((products) => {
          const found = products.find((p) => p.id === productId);
          if (!found) throw new HttpError(404, 'Product not found');
          if (data.price !== undefined) data.price = Number(data.price);
          if (data.originalPrice !== undefined) data.originalPrice = Number(data.originalPrice);
          if (data.stock !== undefined) data.stock = Number(data.stock);
          Object.assign(found, trimStrings(data));
          return { changed: true, value: { ...found } };
        });
        return json(res, 200, updated);
      }
      if (productId !== null && req.method === 'DELETE') {
        await productStore.edit((products) => {
          const idx = products.findIndex((p) => p.id === productId);
          if (idx < 0) throw new HttpError(404, 'Product not found');
          products.splice(idx, 1);
          return { changed: true, value: null };
        });
        res.writeHead(204);
        return res.end();
      }

      // ══════════════════════════════════════════════════════════════════
      //  CART  –  /cart/:userId          (per-user cart)
      //         GET    → view cart
      //         POST   → add item { productId, quantity, size?, color? }
      //         PATCH  → update item quantity { productId, quantity }
      //         DELETE → remove item (body: { productId })
      //         DELETE /cart/:userId/clear → empty entire cart
      // ══════════════════════════════════════════════════════════════════
      const cartMatch = /^\/cart\/(\d+)$/.exec(url.pathname);
      const cartClear = /^\/cart\/(\d+)\/clear$/.exec(url.pathname);
      const cartUserId = cartMatch ? positiveId(cartMatch[1]) : (cartClear ? positiveId(cartClear[1]) : null);

      // Clear entire cart
      if (cartClear && req.method === 'DELETE') {
        const cleared = await cartStore.edit((carts) => {
          const idx = carts.findIndex((c) => c.userId === cartUserId);
          if (idx >= 0) { carts[idx].items = []; }
          return { changed: idx >= 0, value: { userId: cartUserId, items: [] } };
        });
        return json(res, 200, cleared);
      }

      if (cartMatch) {
        // GET – view user's cart
        if (req.method === 'GET') {
          const carts = await cartStore.list();
          const cart = carts.find((c) => c.userId === cartUserId);
          return json(res, 200, cart || { userId: cartUserId, items: [] });
        }

        // POST – add item to cart
        if (req.method === 'POST') {
          const data = await body(req);
          requireFields(data, ['productId', 'quantity']);
          // Verify product exists
          const products = await productStore.list();
          const product = products.find((p) => p.id === Number(data.productId));
          if (!product) throw new HttpError(404, 'Product not found');

          const updated = await cartStore.edit((carts) => {
            let cart = carts.find((c) => c.userId === cartUserId);
            if (!cart) {
              cart = { userId: cartUserId, items: [] };
              carts.push(cart);
            }
            const existing = cart.items.find((i) => i.productId === Number(data.productId));
            if (existing) {
              existing.quantity += Number(data.quantity);
            } else {
              cart.items.push({
                productId: Number(data.productId),
                name: product.name,
                price: product.price,
                quantity: Number(data.quantity),
                size: data.size || null,
                color: data.color || null,
              });
            }
            return { changed: true, value: { ...cart } };
          });
          return json(res, 200, updated);
        }

        // PATCH – update item quantity
        if (req.method === 'PATCH') {
          const data = await body(req);
          requireFields(data, ['productId', 'quantity']);
          const updated = await cartStore.edit((carts) => {
            const cart = carts.find((c) => c.userId === cartUserId);
            if (!cart) throw new HttpError(404, 'Cart not found');
            const item = cart.items.find((i) => i.productId === Number(data.productId));
            if (!item) throw new HttpError(404, 'Item not in cart');
            item.quantity = Number(data.quantity);
            if (item.quantity <= 0) {
              cart.items = cart.items.filter((i) => i.productId !== Number(data.productId));
            }
            return { changed: true, value: { ...cart } };
          });
          return json(res, 200, updated);
        }

        // DELETE – remove specific item
        if (req.method === 'DELETE') {
          const data = await body(req);
          requireFields(data, ['productId']);
          const updated = await cartStore.edit((carts) => {
            const cart = carts.find((c) => c.userId === cartUserId);
            if (!cart) throw new HttpError(404, 'Cart not found');
            const before = cart.items.length;
            cart.items = cart.items.filter((i) => i.productId !== Number(data.productId));
            if (cart.items.length === before) throw new HttpError(404, 'Item not in cart');
            return { changed: true, value: { ...cart } };
          });
          return json(res, 200, updated);
        }
      }

      // ══════════════════════════════════════════════════════════════════
      //  ORDERS
      //  POST   /orders           → place order { userId, shippingAddress, paymentMethod }
      //  GET    /orders           → list all orders
      //  GET    /orders/:id       → get order details
      //  GET    /orders/user/:uid → get orders by user
      //  PATCH  /orders/:id       → update order status { status }
      //  DELETE /orders/:id       → cancel order
      // ══════════════════════════════════════════════════════════════════
      const ordersCol   = matchCollection(url, '/orders');
      const orderId     = matchMember(url, '/orders');
      const orderByUser = /^\/orders\/user\/(\d+)$/.exec(url.pathname);

      // GET /orders/user/:userId  (must come before orderId matching)
      if (orderByUser && req.method === 'GET') {
        const uid = positiveId(orderByUser[1]);
        const orders = await orderStore.list();
        return json(res, 200, orders.filter((o) => o.userId === uid));
      }

      if (ordersCol && req.method === 'GET') {
        return json(res, 200, await orderStore.list());
      }
      if (ordersCol && req.method === 'POST') {
        const data = await body(req);
        requireFields(data, ['userId', 'shippingAddress', 'paymentMethod']);

        // Build order from user's cart
        const carts = await cartStore.list();
        const cart = carts.find((c) => c.userId === Number(data.userId));
        if (!cart || cart.items.length === 0) {
          throw new HttpError(400, 'Cart is empty — add items before placing an order');
        }

        const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= 5000 ? 0 : 250; // Free shipping over PKR 5,000
        const total = subtotal + shipping;

        const order = await orderStore.edit((orders) => {
          const newOrder = {
            id: nextId(orders),
            userId: Number(data.userId),
            items: [...cart.items],
            subtotal,
            shipping,
            total,
            shippingAddress: typeof data.shippingAddress === 'object' ? data.shippingAddress : { raw: data.shippingAddress },
            paymentMethod: data.paymentMethod,
            status: 'Confirmed',
            placedAt: new Date().toISOString(),
          };
          orders.push(newOrder);
          return { changed: true, value: newOrder };
        });

        // Clear the user's cart after placing order
        await cartStore.edit((carts) => {
          const c = carts.find((c) => c.userId === Number(data.userId));
          if (c) c.items = [];
          return { changed: true, value: null };
        });

        events.emit('orderPlaced', order);
        return json(res, 201, order);
      }
      if (orderId !== null && req.method === 'GET') {
        const found = (await orderStore.list()).find((o) => o.id === orderId);
        if (!found) throw new HttpError(404, 'Order not found');
        return json(res, 200, found);
      }
      if (orderId !== null && req.method === 'PATCH') {
        const data = await body(req);
        requireFields(data, ['status']);
        const validStatuses = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(data.status)) {
          throw new HttpError(400, `Status must be one of: ${validStatuses.join(', ')}`);
        }
        const updated = await orderStore.edit((orders) => {
          const found = orders.find((o) => o.id === orderId);
          if (!found) throw new HttpError(404, 'Order not found');
          found.status = data.status;
          found.updatedAt = new Date().toISOString();
          return { changed: true, value: { ...found } };
        });
        return json(res, 200, updated);
      }
      if (orderId !== null && req.method === 'DELETE') {
        const cancelled = await orderStore.edit((orders) => {
          const found = orders.find((o) => o.id === orderId);
          if (!found) throw new HttpError(404, 'Order not found');
          if (found.status === 'Delivered') throw new HttpError(400, 'Cannot cancel a delivered order');
          found.status = 'Cancelled';
          found.updatedAt = new Date().toISOString();
          return { changed: true, value: { ...found } };
        });
        return json(res, 200, cancelled);
      }

      // ── Method not allowed for known paths ──────────────────────────────
      if (usersCol || userId !== null) throw new HttpError(405, 'Method not allowed for /users');
      if (productsCol || productId !== null) throw new HttpError(405, 'Method not allowed for /products');
      if (cartMatch || cartClear) throw new HttpError(405, 'Method not allowed for /cart');
      if (ordersCol || orderId !== null || orderByUser) throw new HttpError(405, 'Method not allowed for /orders');

      // ── 404 ─────────────────────────────────────────────────────────────
      throw new HttpError(404, 'Route not found');

    } catch (error) {
      if (res.headersSent) { res.destroy(error); return; }
      if (!(error instanceof HttpError)) console.error('[unexpected]', error);
      json(res, error instanceof HttpError ? error.status : 500,
        { error: error instanceof HttpError ? error.message : 'Internal server error' });
    }
  });

  return server;
}

module.exports = { createApp };
