// Lab 7 – Task 1: Student Management System (In-Memory API)
// Based on: Step 24 – A tiny API storing data in memory only.
// Modules: Student (CRUD), Teacher (CRUD), Attendance (CRUD), Marks (CRUD)
// No authorization required.

const http = require('node:http');

// ─── In-Memory Data Stores ──────────────────────────────────────────────────

let students = [];
let teachers = [];
let attendances = [];
let marks = [];

let nextStudentId = 1;
let nextTeacherId = 1;
let nextAttendanceId = 1;
let nextMarksId = 1;

// ─── Helpers ────────────────────────────────────────────────────────────────

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

async function parseBody(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk.toString('utf8');
    if (Buffer.byteLength(raw) > 65536) {
      return { error: 'Request body too large', status: 413 };
    }
  }
  try {
    return { data: JSON.parse(raw) };
  } catch {
    return { error: 'Invalid JSON', status: 400 };
  }
}

function validateRequired(obj, fields) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return '"body" must be a JSON object';
  }
  for (const field of fields) {
    if (obj[field] === undefined || obj[field] === null || String(obj[field]).trim() === '') {
      return `"${field}" is required`;
    }
  }
  return null;
}

function parseId(text) {
  const id = Number(text);
  if (!Number.isInteger(id) || id < 1) return null;
  return id;
}

// ─── CRUD Handler Factory ───────────────────────────────────────────────────

function createCRUD({ basePath, store, getNextId, advanceId, requiredFields }) {
  // Returns true if route matched, false otherwise.
  return async function handle(req, res, url) {
    const isCollection = url.pathname === basePath;
    const memberMatch = new RegExp(`^${basePath}/(\\d+)$`).exec(url.pathname);
    const id = memberMatch ? parseId(memberMatch[1]) : null;

    if (!isCollection && id === null) return false;

    // GET /resource — list all
    if (isCollection && req.method === 'GET') {
      send(res, 200, store());
      return true;
    }

    // POST /resource — create
    if (isCollection && req.method === 'POST') {
      const parsed = await parseBody(req);
      if (parsed.error) { send(res, parsed.status, { error: parsed.error }); return true; }

      const err = validateRequired(parsed.data, requiredFields);
      if (err) { send(res, 400, { error: err }); return true; }

      const record = { id: getNextId() };
      for (const key of Object.keys(parsed.data)) {
        record[key] = typeof parsed.data[key] === 'string' ? parsed.data[key].trim() : parsed.data[key];
      }
      advanceId();
      store().push(record);
      send(res, 201, record);
      return true;
    }

    // GET /resource/:id — read one
    if (id !== null && req.method === 'GET') {
      const found = store().find((r) => r.id === id);
      if (!found) { send(res, 404, { error: 'Not found' }); return true; }
      send(res, 200, found);
      return true;
    }

    // PUT /resource/:id — full update
    if (id !== null && req.method === 'PUT') {
      const parsed = await parseBody(req);
      if (parsed.error) { send(res, parsed.status, { error: parsed.error }); return true; }

      const err = validateRequired(parsed.data, requiredFields);
      if (err) { send(res, 400, { error: err }); return true; }

      const found = store().find((r) => r.id === id);
      if (!found) { send(res, 404, { error: 'Not found' }); return true; }

      for (const key of Object.keys(parsed.data)) {
        if (key !== 'id') found[key] = typeof parsed.data[key] === 'string' ? parsed.data[key].trim() : parsed.data[key];
      }
      send(res, 200, found);
      return true;
    }

    // PATCH /resource/:id — partial update
    if (id !== null && req.method === 'PATCH') {
      const parsed = await parseBody(req);
      if (parsed.error) { send(res, parsed.status, { error: parsed.error }); return true; }

      if (!parsed.data || typeof parsed.data !== 'object' || Array.isArray(parsed.data)) {
        send(res, 400, { error: '"body" must be a JSON object' });
        return true;
      }

      const found = store().find((r) => r.id === id);
      if (!found) { send(res, 404, { error: 'Not found' }); return true; }

      for (const key of Object.keys(parsed.data)) {
        if (key !== 'id') found[key] = typeof parsed.data[key] === 'string' ? parsed.data[key].trim() : parsed.data[key];
      }
      send(res, 200, found);
      return true;
    }

    // DELETE /resource/:id — delete
    if (id !== null && req.method === 'DELETE') {
      const index = store().findIndex((r) => r.id === id);
      if (index < 0) { send(res, 404, { error: 'Not found' }); return true; }
      store().splice(index, 1);
      send(res, 200, { message: 'Deleted successfully' });
      return true;
    }

    // Method not allowed
    if (isCollection || id !== null) {
      send(res, 405, { error: 'Method not allowed' });
      return true;
    }

    return false;
  };
}

// ─── Module Routers ─────────────────────────────────────────────────────────

const studentCRUD = createCRUD({
  basePath: '/students',
  store: () => students,
  getNextId: () => nextStudentId,
  advanceId: () => nextStudentId++,
  requiredFields: ['name', 'email', 'department'],
});

const teacherCRUD = createCRUD({
  basePath: '/teachers',
  store: () => teachers,
  getNextId: () => nextTeacherId,
  advanceId: () => nextTeacherId++,
  requiredFields: ['name', 'email', 'subject'],
});

const attendanceCRUD = createCRUD({
  basePath: '/attendances',
  store: () => attendances,
  getNextId: () => nextAttendanceId,
  advanceId: () => nextAttendanceId++,
  requiredFields: ['studentId', 'date', 'status'],
});

const marksCRUD = createCRUD({
  basePath: '/marks',
  store: () => marks,
  getNextId: () => nextMarksId,
  advanceId: () => nextMarksId++,
  requiredFields: ['studentId', 'subject', 'obtainedMarks', 'totalMarks'],
});

const routers = [studentCRUD, teacherCRUD, attendanceCRUD, marksCRUD];

// ─── Server ─────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');

    // Health check
    if (req.method === 'GET' && url.pathname === '/health') {
      return send(res, 200, { status: 'ok' });
    }

    // Try each module router
    for (const router of routers) {
      const matched = await router(req, res, url);
      if (matched) return;
    }

    send(res, 404, { error: 'Route not found' });
  } catch (error) {
    console.error('[unexpected]', error);
    if (!res.headersSent) {
      send(res, 500, { error: 'Internal server error' });
    }
  }
});

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
  console.log(`\nStudent Management System (In-Memory API)`);
  console.log(`Server running at http://localhost:${PORT}\n`);
  console.log('Available endpoints:');
  console.log('  GET|POST         /students');
  console.log('  GET|PUT|PATCH|DELETE  /students/:id');
  console.log('  GET|POST         /teachers');
  console.log('  GET|PUT|PATCH|DELETE  /teachers/:id');
  console.log('  GET|POST         /attendances');
  console.log('  GET|PUT|PATCH|DELETE  /attendances/:id');
  console.log('  GET|POST         /marks');
  console.log('  GET|PUT|PATCH|DELETE  /marks/:id');
  console.log('  GET              /health\n');
});
