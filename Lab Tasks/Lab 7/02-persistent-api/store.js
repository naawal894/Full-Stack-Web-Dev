// Lab 7 – Task 2: E-Commerce Store – Persistent JSON File Store
// Reads/writes JSON data files with atomic write-and-rename, same pattern
// as the class reference (temp/02-persistent-api/store.js).

const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

function createStore(file) {
  let writeQueue = Promise.resolve();

  async function loadFromFile() {
    try {
      return JSON.parse(await fs.readFile(file, 'utf8'));
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }

  async function list() {
    await writeQueue;
    return loadFromFile();
  }

  function edit(change) {
    const operation = writeQueue.then(async () => {
      const records = await loadFromFile();
      const result = change(records);
      if (result.changed) {
        await fs.mkdir(path.dirname(file), { recursive: true });
        const temp = `${file}.${randomUUID()}.tmp`;
        try {
          await fs.writeFile(temp, JSON.stringify(records, null, 2), 'utf8');
          await fs.rename(temp, file);
        } catch (error) {
          await fs.rm(temp, { force: true }).catch(() => {});
          throw error;
        }
      }
      return result.value;
    });
    writeQueue = operation.then(() => undefined, () => undefined);
    return operation;
  }

  return { list, edit };
}

module.exports = { createStore };
