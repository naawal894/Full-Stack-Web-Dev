import Student from './Student.js';
import { calculateGrade as getGrade, calculateAverage, calculateGPA } from './gradeUtils.js';
import { processTranscriptsJSON, generateReport, reportToJSON } from './transcriptService.js';

console.log('Aliased import test (88 marks):', getGrade(88));

function runTest(title, jsonInput) {
  console.log(`\nTesting: ${title}`);
  try {
    const students = processTranscriptsJSON(jsonInput);
    const report = generateReport(students);
    console.log('Report JSON:');
    console.log(reportToJSON(report));
  } catch (err) {
    console.log(`Caught error [${err.name}]:`, err.message);
  } finally {
    console.log(`Finished test: ${title}`);
  }
}

// 1. Valid JSON
const validData = JSON.stringify([
  {
    id: 101,
    name: 'Ali Khan',
    courses: [
      { code: 'CS301', marks: 81 },
      { code: 'CS302', marks: 74 }
    ]
  },
  {
    id: 102,
    name: 'Sara Ahmed',
    courses: [
      { code: 'CS301', marks: 92 },
      { code: 'CS302', marks: 88 }
    ]
  }
]);
runTest('Valid Transcripts', validData);

// 2. Malformed JSON
runTest('Malformed JSON', '{ "id": 101, name: missing-quotes }');

// 3. Missing ID
runTest('Missing Student ID', JSON.stringify([{ name: 'No ID', courses: [{ code: 'CS101', marks: 70 }] }]));

// 4. Duplicate ID
runTest('Duplicate ID', JSON.stringify([
  { id: 101, name: 'First', courses: [{ code: 'CS101', marks: 80 }] },
  { id: 101, name: 'Second', courses: [{ code: 'CS102', marks: 75 }] }
]));

// 5. Out of range marks
runTest('Marks out of range', JSON.stringify([
  { id: 103, name: 'Bilal', courses: [{ code: 'CS301', marks: 110 }] }
]));

// 6. Missing course code
runTest('Missing course code', JSON.stringify([
  { id: 104, name: 'Zoya', courses: [{ marks: 85 }] }
]));
