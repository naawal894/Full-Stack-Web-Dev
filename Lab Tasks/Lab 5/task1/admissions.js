const validPrograms = ['BSCS', 'BSSE', 'BSAI', 'BSIT'];

export function sanitizeApplicant(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const toNum = (val) => {
    if (val === null || val === undefined || typeof val === 'boolean') return NaN;
    const s = String(val).trim();
    return s === '' ? NaN : Number(s);
  };

  return {
    id: String(raw.id ?? '').trim(),
    name: String(raw.name ?? '').trim(),
    age: toNum(raw.age),
    matricMarks: toNum(raw.matricMarks),
    intermediateMarks: toNum(raw.intermediateMarks),
    entryTest: toNum(raw.entryTest),
    program: String(raw.program ?? '').trim().toUpperCase(),
    feePaid: raw.feePaid === true || String(raw.feePaid).trim().toLowerCase() === 'true'
  };
}

export function validateApplicant(app) {
  if (!app || !app.id || !app.name) return { valid: false, reason: 'Missing id or name' };
  if (isNaN(app.age) || isNaN(app.matricMarks) || isNaN(app.intermediateMarks) || isNaN(app.entryTest)) {
    return { valid: false, reason: 'Invalid numeric fields' };
  }
  if (app.age < 17 || app.age > 30) {
    return { valid: false, reason: 'Age out of range (17-30)' };
  }
  if ([app.matricMarks, app.intermediateMarks, app.entryTest].some(m => m < 0 || m > 100)) {
    return { valid: false, reason: 'Marks must be between 0 and 100' };
  }
  if (!validPrograms.includes(app.program)) {
    return { valid: false, reason: 'Unsupported program' };
  }
  return { valid: true };
}

export function calculateMerit(app) {
  const merit = (app.matricMarks * 0.20) + (app.intermediateMarks * 0.30) + (app.entryTest * 0.50);
  return Number(merit.toFixed(2));
}

export function determineStatus(merit, entryTest, intermediate, feePaid) {
  if (merit < 70 || entryTest < 60 || intermediate < 60) {
    return 'REJECTED';
  }
  return (feePaid && merit >= 75) ? 'SELECTED' : 'WAITING';
}

export function processApplicant(raw) {
  const sanitized = sanitizeApplicant(raw);
  const validation = validateApplicant(sanitized);

  if (!validation.valid) {
    return {
      ...sanitized,
      merit: null,
      status: 'INVALID DATA',
      reason: validation.reason,
      isValid: false
    };
  }

  const merit = calculateMerit(sanitized);
  const status = determineStatus(merit, sanitized.entryTest, sanitized.intermediateMarks, sanitized.feePaid);

  return {
    ...sanitized,
    merit,
    status,
    isValid: true
  };
}

export function processAllApplicants(applicants) {
  return applicants.map(processApplicant);
}

export function generateSummary(results) {
  let validCount = 0;
  let invalidCount = 0;
  let totalMerit = 0;
  let highest = null;
  let lowest = null;
  const programCounts = {};

  for (const item of results) {
    if (item.program) {
      programCounts[item.program] = (programCounts[item.program] || 0) + 1;
    }

    if (!item.isValid) {
      invalidCount++;
      continue;
    }

    validCount++;
    totalMerit += item.merit;

    if (!highest || item.merit > highest.merit) highest = item;
    if (!lowest || item.merit < lowest.merit) lowest = item;
  }

  return {
    validApplicants: validCount,
    invalidApplicants: invalidCount,
    highestMeritApplicant: highest ? { id: highest.id, name: highest.name, merit: highest.merit } : null,
    lowestMeritAmongValid: lowest ? { id: lowest.id, name: lowest.name, merit: lowest.merit } : null,
    averageMerit: validCount ? Number((totalMerit / validCount).toFixed(2)) : 0,
    applicantsPerProgram: programCounts
  };
}

const applicants = [
  { id: 'A101', name: 'Sara Khan', age: '19', matricMarks: '91', intermediateMarks: '87', entryTest: '78', program: 'BSCS', feePaid: 'true' },
  { id: 'A102', name: 'Ahmed Ali', age: 'twenty', matricMarks: '88', intermediateMarks: '', entryTest: '72', program: 'BSSE', feePaid: 'false' },
  { id: 'A103', name: 'Hassan', age: '18', matricMarks: '76', intermediateMarks: '83', entryTest: '91', program: 'BSAI', feePaid: 'true' },
  { id: 'A104', name: 'Bilal Tariq', age: '17', matricMarks: '70', intermediateMarks: '70', entryTest: '70', program: 'BSCS', feePaid: 'false' },
  { id: 'A105', name: 'Zainab Noor', age: '30', matricMarks: '80', intermediateMarks: '60', entryTest: '72', program: 'BSIT', feePaid: 'true' },
  { id: 'A106', name: 'Hamza Malik', age: '21', matricMarks: '55', intermediateMarks: '58', entryTest: '52', program: 'BSSE', feePaid: 'true' }
];

const processed = processAllApplicants(applicants);
console.log('Processed Applicants:');
console.table(processed.map(a => ({
  id: a.id,
  name: a.name,
  merit: a.merit ?? 'N/A',
  status: a.status,
  reason: a.reason ?? '-'
})));

console.log('\nSummary:');
console.log(generateSummary(processed));
