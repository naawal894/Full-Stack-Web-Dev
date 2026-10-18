// Task 2: Academic Performance Intelligence Engine

export function getGradeInfo(marks) {
  if (marks >= 85) return { grade: 'A', gradePoints: 4.0 };
  if (marks >= 80) return { grade: 'A-', gradePoints: 3.7 };
  if (marks >= 75) return { grade: 'B+', gradePoints: 3.3 };
  if (marks >= 70) return { grade: 'B', gradePoints: 3.0 };
  if (marks >= 65) return { grade: 'B-', gradePoints: 2.7 };
  if (marks >= 60) return { grade: 'C+', gradePoints: 2.3 };
  if (marks >= 50) return { grade: 'C', gradePoints: 2.0 };
  return { grade: 'F', gradePoints: 0.0 };
}

export function processResults(results) {
  return results.map(s => {
    const info = getGradeInfo(s.marks);
    return {
      ...s,
      grade: info.grade,
      gradePoints: info.gradePoints,
      status: s.marks >= 50 ? 'Passed' : 'Failed'
    };
  });
}

// Sort by marks descending, then name alphabetically (non-mutating)
export function getRankedMeritList(list) {
  return [...list].sort((a, b) => b.marks !== a.marks ? b.marks - a.marks : a.name.localeCompare(b.name));
}

// Department statistics using reduce
export function getDepartmentStatistics(list) {
  return list.reduce((stats, s) => {
    const dept = s.department;
    if (!stats[dept]) {
      stats[dept] = { students: 0, total: 0, highest: s.marks, passed: 0 };
    }
    stats[dept].students++;
    stats[dept].total += s.marks;
    if (s.marks > stats[dept].highest) stats[dept].highest = s.marks;
    if (s.marks >= 50) stats[dept].passed++;
    stats[dept].average = Number((stats[dept].total / stats[dept].students).toFixed(2));
    return stats;
  }, {});
}

// Academic queries using array methods
export function runAcademicQueries(processed, ranked) {
  const firstAbove85 = processed.find(s => s.marks > 85);
  const firstFailedIndex = processed.findIndex(s => s.marks < 50);
  const anyFailed = processed.some(s => s.marks < 50);
  const allInRange = processed.every(s => s.marks >= 0 && s.marks <= 100);

  const total = processed.reduce((sum, s) => sum + s.marks, 0);
  const avg = Number((total / processed.length).toFixed(2));
  const aboveAvg = processed.filter(s => s.marks > avg);
  const topThree = ranked.slice(0, 3).map(s => s.name);

  return {
    firstAbove85,
    firstFailedIndex,
    anyFailed,
    allInRange,
    overallAverage: avg,
    aboveAvg,
    topThree
  };
}

const results = [
  { id: 1, name: 'Ali', department: 'CS', course: 'FSWD', marks: 82 },
  { id: 2, name: 'Sara', department: 'CS', course: 'FSWD', marks: 91 },
  { id: 3, name: 'Usman', department: 'SE', course: 'FSWD', marks: 47 },
  { id: 4, name: 'Hina', department: 'AI', course: 'FSWD', marks: 73 },
  { id: 5, name: 'Ahmed', department: 'SE', course: 'FSWD', marks: 64 },
  { id: 6, name: 'Zoya', department: 'AI', course: 'FSWD', marks: 91 }
];

const processed = processResults(results);
const ranked = getRankedMeritList(processed);
const deptStats = getDepartmentStatistics(processed);
const queries = runAcademicQueries(processed, ranked);

console.log('Processed Students:');
processed.forEach(s => console.log(`${s.name} (${s.department}): ${s.marks} -> ${s.grade} (${s.status})`));

console.log('\nDepartment Stats:');
console.log(deptStats);

console.log('\nAcademic Queries:');
console.log('First student > 85:', queries.firstAbove85?.name);
console.log('First failed index:', queries.firstFailedIndex);
console.log('Any student failed:', queries.anyFailed);
console.log('All marks valid:', queries.allInRange);
console.log('Class average:', queries.overallAverage);
console.log('Top 3 students:', queries.topThree);
