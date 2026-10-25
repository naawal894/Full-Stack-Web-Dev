// Lab 7 – Task 2: E-Commerce Store Server Entry Point
const path = require('node:path');
const { createApp } = require('./app.js');

const port = Number(process.env.PORT || 3006);
const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data');

const server = createApp(dataDir);

server.listen(port, () => {
  console.log(`\n======================================================`);
  console.log(`  ETHNC E-Commerce Persistent REST API`);
  console.log(`======================================================`);
  console.log(`Server running at: http://localhost:${port}`);
  console.log(`Persistent data directory: ${dataDir}\n`);
  console.log(`Available Resources:`);
  console.log(`  Users:    http://localhost:${port}/users`);
  console.log(`  Products: http://localhost:${port}/products`);
  console.log(`  Cart:     http://localhost:${port}/cart/:userId`);
  console.log(`  Orders:   http://localhost:${port}/orders`);
  console.log(`  Health:   http://localhost:${port}/health\n`);
});
