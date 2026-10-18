// Task 1: Admission Decision and Data Sanitization Engine

const validPrograms = ['BSCS', 'BSSE', 'BSAI', 'BSIT'];

export function processApplicant(raw) {
  // Convert string inputs to numbers
  const age = Number(raw.age);
  const matric = Number(raw.matricMarks);
  const inter = Number(raw.intermediateMarks);
  const entryTest = Number(raw.entryTest);
  const feePaid = raw.feePaid === true || raw.feePaid === 'true';
  const program = raw.program;

  // Validate numbers
  if (isNaN(age) || isNaN(matric) || isNaN(inter) || isNaN(entryTest)) {
    return { id: raw.id, name: raw.name, status: 'INVALID DATA', isValid: false };
  }

  // Validate ranges
  if (age < 17 || age > 30 || matric < 0 || matric > 100 || inter < 0 || inter > 100 || entryTest < 0 || entryTest > 100) {
    return { id: raw.id, name: raw.name, status: 'INVALID DATA', isValid: false };
  }

  // Validate program
  if (!validPrograms.includes(program)) {
    return { id: raw.id, name: raw.name, status: 'INVALID DATA', isValid: false };
  }

  // Calculate merit: 20% Matric, 30% Inter, 50% Entry Test
  const merit = Number((matric * 0.20 + inter * 0.30 + entryTest * 0.50).toFixed(2));

  // Determine eligibility status
  let status = 'REJECTED';
  if (merit >= 70 && entryTest >= 60 && inter >= 60) {
    status = (feePaid && merit >= 75) ? 'SELECTED' : 'WAITING';
  }

  return {
    id: raw.id,
    name: raw.name,
    program,
    merit,
    status,
    isValid: true
  };
}

export function generateSummary(results) {
  let validCount = 0;
  let invalidCount = 0;
  let totalMerit = 0;
  let highest = null;
  let lowest = null;
  const programCounts = {};

  for (const a of results) {
    if (a.program) {
      programCounts[a.program] = (programCounts[a.program] || 0) + 1;
    }

    if (!a.isValid) {
      invalidCount++;
      continue;
    }

    validCount++;
    totalMerit += a.merit;

    if (!highest || a.merit > highest.merit) highest = a;
    if (!lowest || a.merit < lowest.merit) lowest = a;
  }

  return {
    validCount,
    invalidCount,
    highestMerit: highest ? { name: highest.name, merit: highest.merit } : null,
    lowestMerit: lowest ? { name: lowest.name, merit: lowest.merit } : null,
    averageMerit: validCount ? Number((totalMerit / validCount).toFixed(2)) : 0,
    programCounts
  };
}

// Sample applicants
const applicants = [
  { id: 'A101', name: 'Sara Khan', age: '19', matricMarks: '91', intermediateMarks: '87', entryTest: '78', program: 'BSCS', feePaid: 'true' },
  { id: 'A102', name: 'Ahmed Ali', age: 'twenty', matricMarks: '88', intermediateMarks: '', entryTest: '72', program: 'BSSE', feePaid: 'false' },
  { id: 'A103', name: 'Hassan', age: '18', matricMarks: '76', intermediateMarks: '83', entryTest: '91', program: 'BSAI', feePaid: 'true' },
  { id: 'A104', name: 'Bilal Tariq', age: '17', matricMarks: '70', intermediateMarks: '70', entryTest: '70', program: 'BSCS', feePaid: 'false' }
];

const processed = applicants.map(processApplicant);
console.log('Processed Applicants:');
processed.forEach(p => console.log(`${p.id} - ${p.name}: ${p.status} (Merit: ${p.merit ?? 'N/A'})`));

console.log('\nSummary:');
console.log(generateSummary(processed));
