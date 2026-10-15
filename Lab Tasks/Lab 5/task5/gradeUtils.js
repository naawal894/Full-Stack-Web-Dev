export function calculateGrade(marks) {
  if (typeof marks !== 'number' || isNaN(marks)) {
    throw new TypeError(`Marks must be a number, received: ${typeof marks}`);
  }
  if (marks < 0 || marks > 100) {
    throw new RangeError(`Marks must be between 0 and 100, received: ${marks}`);
  }

  if (marks >= 85) return 'A';
  if (marks >= 80) return 'A-';
  if (marks >= 75) return 'B+';
  if (marks >= 70) return 'B';
  if (marks >= 65) return 'B-';
  if (marks >= 60) return 'C+';
  if (marks >= 50) return 'C';
  return 'F';
}

export function getGradePoint(marks) {
  if (marks >= 85) return 4.0;
  if (marks >= 80) return 3.7;
  if (marks >= 75) return 3.3;
  if (marks >= 70) return 3.0;
  if (marks >= 65) return 2.7;
  if (marks >= 60) return 2.3;
  if (marks >= 50) return 2.0;
  return 0.0;
}

export function calculateAverage(marksList) {
  if (!Array.isArray(marksList) || marksList.length === 0) return 0;
  const sum = marksList.reduce((acc, m) => acc + m, 0);
  return Number((sum / marksList.length).toFixed(2));
}

export function calculateGPA(courses) {
  if (!Array.isArray(courses) || courses.length === 0) return 0.0;
  const points = courses.map(c => getGradePoint(c.marks));
  const sum = points.reduce((acc, p) => acc + p, 0);
  return Number((sum / courses.length).toFixed(2));
}
