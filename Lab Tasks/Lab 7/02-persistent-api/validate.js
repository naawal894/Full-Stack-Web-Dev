// Lab 7 – Task 2: E-Commerce Store – Persistent API
// Validates input and provides structured HTTP error handling.
// Entities: User, Product, Cart, Order

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function positiveId(text) {
  if (!/^[1-9]\d*$/.test(text)) throw new HttpError(400, 'ID must be a positive integer');
  const id = Number(text);
  if (!Number.isSafeInteger(id)) throw new HttpError(400, 'ID is too large');
  return id;
}

function requireFields(value, fields, partial = false) {
  if (!value || Array.isArray(value) || typeof value !== 'object') {
    throw new HttpError(400, 'A JSON object is required');
  }
  if (partial) {
    const keys = Object.keys(value);
    if (keys.length === 0) throw new HttpError(400, 'Give at least one field to update');
    return;
  }
  for (const field of fields) {
    if (value[field] === undefined || value[field] === null || String(value[field]).trim() === '') {
      throw new HttpError(400, `"${field}" is required`);
    }
  }
}

function trimStrings(obj) {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    result[key] = typeof val === 'string' ? val.trim() : val;
  }
  return result;
}

module.exports = { HttpError, positiveId, requireFields, trimStrings };
