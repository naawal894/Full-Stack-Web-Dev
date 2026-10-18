// Task 8: Concurrent Academic API Aggregator with async/await

const mockUsers = [
  { id: 1, name: 'Sara Khan', department: 'CS' },
  { id: 2, name: 'Ali Ahmed', department: 'CS' },
  { id: 3, name: 'Usman Tariq', department: 'SE' }
];

const mockCourses = [
  { code: 'CS301', title: 'Data Structures' },
  { code: 'CS302', title: 'Web Development' }
];

const mockResults = [
  { studentId: 1, marks: 92, department: 'CS' },
  { studentId: 2, marks: 78, department: 'CS' },
  { studentId: 3, marks: 44, department: 'SE' }
];

// Simulated fetch for lab testing
export function fakeFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const delay = url === '/slow' ? 200 : 20;

    const timer = setTimeout(() => {
      if (options.signal?.aborted) {
        return reject(new Error('Request aborted'));
      }
      if (url === '/network-err') return reject(new Error('Network connection failed'));
      if (url === '/not-found') return resolve({ ok: false, status: 404, json: async () => ({ error: 'Not found' }) });
      if (url === '/bad-json') return resolve({ ok: true, status: 200, json: async () => { throw new SyntaxError('Invalid JSON'); } });
      if (url === '/users') return resolve({ ok: true, status: 200, json: async () => mockUsers });
      if (url === '/courses') return resolve({ ok: true, status: 200, json: async () => mockCourses });
      if (url === '/results' || url === '/slow') return resolve({ ok: true, status: 200, json: async () => mockResults });

      resolve({ ok: false, status: 404, json: async () => ({ error: 'Unknown route' }) });
    }, delay);

    if (options.signal) {
      options.signal.onabort = () => {
        clearTimeout(timer);
        reject(new Error('Request aborted'));
      };
    }
  });
}

// Safe JSON fetcher
export async function getJSON(url, fetchFn = fakeFetch, options = {}) {
  const res = await fetchFn(url, options);
  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }
  return await res.json();
}

// Concurrent loading using Promise.all
export async function loadDashboard(fetchFn = fakeFetch) {
  const [users, courses, results] = await Promise.all([
    getJSON('/users', fetchFn),
    getJSON('/courses', fetchFn),
    getJSON('/results', fetchFn)
  ]);

  const totalStudents = users.length;
  const totalCourses = courses.length;

  const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
  const average = Number((totalMarks / results.length).toFixed(2));
  const failedCount = results.filter(r => r.marks < 50).length;

  const topResult = [...results].sort((a, b) => b.marks - a.marks)[0];
  const topStudent = users.find(u => u.id === topResult.studentId);

  // Department statistics
  const departmentStats = {};
  for (const r of results) {
    const d = r.department;
    if (!departmentStats[d]) departmentStats[d] = { count: 0, total: 0, highest: r.marks };
    departmentStats[d].count++;
    departmentStats[d].total += r.marks;
    if (r.marks > departmentStats[d].highest) departmentStats[d].highest = r.marks;
  }

  for (const d of Object.keys(departmentStats)) {
    departmentStats[d].average = Number((departmentStats[d].total / departmentStats[d].count).toFixed(2));
  }

  return {
    totalStudents,
    totalCourses,
    averageMarks: average,
    failedCount,
    topStudent: { name: topStudent?.name, marks: topResult.marks },
    departmentStats
  };
}

// Timeout challenge using AbortController and try/finally
export async function fetchWithTimeout(url, ms, fetchFn = fakeFetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    return await getJSON(url, fetchFn, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Tests
async function run() {
  console.log('Loading Dashboard Concurrently:');
  const dashboard = await loadDashboard();
  console.log(dashboard);

  console.log('\nTesting fetchWithTimeout:');
  try {
    const data = await fetchWithTimeout('/results', 100);
    console.log(`Success: loaded ${data.length} results`);
  } catch (err) {
    console.log('Failed:', err.message);
  }

  console.log('\nTesting Timeout Abort:');
  try {
    await fetchWithTimeout('/slow', 50);
  } catch (err) {
    console.log('Caught expected timeout:', err.message);
  }

  console.log('\nTesting 404 Status:');
  try {
    await fetchWithTimeout('/not-found', 100);
  } catch (err) {
    console.log('Caught error:', err.message);
  }
}

run();
