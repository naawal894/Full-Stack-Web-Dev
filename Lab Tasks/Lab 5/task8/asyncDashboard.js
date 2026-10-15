const mockUsers = [
  { id: 1, name: 'Sara Khan', role: 'student', department: 'CS' },
  { id: 2, name: 'Ali Ahmed', role: 'student', department: 'CS' },
  { id: 3, name: 'Usman Tariq', role: 'student', department: 'SE' },
  { id: 4, name: 'Hina Bilal', role: 'student', department: 'AI' }
];

const mockCourses = [
  { code: 'CS301', title: 'Data Structures' },
  { code: 'CS302', title: 'Databases' },
  { code: 'SE301', title: 'Software Design' }
];

const mockResults = [
  { studentId: 1, marks: 92, department: 'CS' },
  { studentId: 2, marks: 78, department: 'CS' },
  { studentId: 3, marks: 44, department: 'SE' },
  { studentId: 4, marks: 88, department: 'AI' }
];

export function fakeFetch(url, options = {}) {
  const signal = options.signal;

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      const err = new Error('Request aborted');
      err.name = 'AbortError';
      return reject(err);
    }

    const delay = url === '/slow' ? 300 : 30;
    const timer = setTimeout(() => {
      if (url === '/network-err') {
        return reject(new TypeError('Network connection failed'));
      }
      if (url === '/not-found') {
        return resolve({ ok: false, status: 404, json: async () => ({ error: 'Not found' }) });
      }
      if (url === '/server-err') {
        return resolve({ ok: false, status: 500, json: async () => ({ error: 'Server error' }) });
      }
      if (url === '/bad-json') {
        return resolve({ ok: true, status: 200, json: async () => { throw new SyntaxError('Invalid JSON'); } });
      }
      if (url === '/users') {
        return resolve({ ok: true, status: 200, json: async () => mockUsers });
      }
      if (url === '/courses') {
        return resolve({ ok: true, status: 200, json: async () => mockCourses });
      }
      if (url === '/results' || url === '/slow') {
        return resolve({ ok: true, status: 200, json: async () => mockResults });
      }

      resolve({ ok: false, status: 404, json: async () => ({ error: 'Unknown route' }) });
    }, delay);

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        const err = new Error('Request aborted');
        err.name = 'AbortError';
        reject(err);
      }, { once: true });
    }
  });
}

export async function getJSON(url, fetchFn = fakeFetch, options = {}) {
  const res = await fetchFn(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return await res.json();
}

export async function loadDashboard(fetchFn = fakeFetch) {
  // Concurrent loading with Promise.all
  const [users, courses, results] = await Promise.all([
    getJSON('/users', fetchFn),
    getJSON('/courses', fetchFn),
    getJSON('/results', fetchFn)
  ]);

  const students = users.filter(u => u.role === 'student');
  const totalStudents = students.length;
  const totalCourses = courses.length;

  const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
  const average = Number((totalMarks / results.length).toFixed(2));
  const failed = results.filter(r => r.marks < 50).length;

  const topResult = [...results].sort((a, b) => b.marks - a.marks)[0];
  const topStudent = users.find(u => u.id === topResult.studentId);

  // Department statistics
  const deptStats = {};
  for (const r of results) {
    const d = r.department;
    if (!deptStats[d]) deptStats[d] = { count: 0, total: 0, highest: r.marks };
    deptStats[d].count++;
    deptStats[d].total += r.marks;
    if (r.marks > deptStats[d].highest) deptStats[d].highest = r.marks;
  }

  for (const d of Object.keys(deptStats)) {
    deptStats[d].average = Number((deptStats[d].total / deptStats[d].count).toFixed(2));
  }

  return {
    totalStudents,
    totalCourses,
    overallAverage: average,
    failedCount: failed,
    topPerformer: { name: topStudent?.name, marks: topResult.marks },
    departmentStats: deptStats
  };
}

export async function fetchWithTimeout(url, ms, fetchFn = fakeFetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    return await getJSON(url, fetchFn, { signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      const e = new Error(`Request timed out after ${ms}ms`);
      e.type = 'TIMEOUT';
      throw e;
    }
    if (err.status) {
      err.type = 'HTTP_ERROR';
      throw err;
    }
    if (err instanceof SyntaxError) {
      err.type = 'JSON_ERROR';
      throw err;
    }
    if (err instanceof TypeError) {
      err.type = 'NETWORK_ERROR';
      throw err;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// Tests
async function run() {
  console.log('Loading Dashboard concurrently:');
  const dashboard = await loadDashboard();
  console.log(dashboard);

  console.log('\nTesting fetchWithTimeout:');

  // Normal success
  try {
    const res = await fetchWithTimeout('/results', 200);
    console.log('Success (within 200ms):', res.length, 'results loaded');
  } catch (e) {
    console.log('Failed:', e.message);
  }

  // Timeout test
  try {
    await fetchWithTimeout('/slow', 50);
  } catch (e) {
    console.log(`Caught [${e.type}]:`, e.message);
  }

  // 404 test
  try {
    await fetchWithTimeout('/not-found', 200);
  } catch (e) {
    console.log(`Caught [${e.type}]:`, e.message, `(Status ${e.status})`);
  }

  // Network error test
  try {
    await fetchWithTimeout('/network-err', 200);
  } catch (e) {
    console.log(`Caught [${e.type}]:`, e.message);
  }

  // Bad JSON test
  try {
    await fetchWithTimeout('/bad-json', 200);
  } catch (e) {
    console.log(`Caught [${e.type}]:`, e.message);
  }
}

run();
