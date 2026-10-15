import Student from './Student.js';
import { calculateGrade, calculateAverage, calculateGPA } from './gradeUtils.js';

export function processTranscriptsJSON(jsonString) {
  let rawData;
  try {
    rawData = JSON.parse(jsonString);
  } catch (err) {
    throw new SyntaxError(`Invalid JSON: ${err.message}`);
  }

  if (!Array.isArray(rawData)) {
    throw new TypeError('Expected an array of students');
  }

  const seenIds = new Set();
  const students = [];

  for (const item of rawData) {
    if (!item || typeof item !== 'object') {
      throw new TypeError('Invalid student record');
    }

    if (item.id === undefined || item.id === null || String(item.id).trim() === '') {
      throw new TypeError('Student ID is missing');
    }

    if (seenIds.has(item.id)) {
      throw new Error(`Duplicate student ID: ${item.id}`);
    }
    seenIds.add(item.id);

    if (!Array.isArray(item.courses) || item.courses.length === 0) {
      throw new Error(`Student ${item.id} has no courses`);
    }

    const validatedCourses = [];
    const marksList = [];

    for (const c of item.courses) {
      if (!c.code || typeof c.code !== 'string' || c.code.trim() === '') {
        throw new TypeError(`Missing course code for student ${item.id}`);
      }
      if (typeof c.marks !== 'number' || isNaN(c.marks)) {
        throw new TypeError(`Invalid marks in course ${c.code}`);
      }
      if (c.marks < 0 || c.marks > 100) {
        throw new RangeError(`Marks out of range (0-100) for course ${c.code}`);
      }

      validatedCourses.push({
        code: c.code.trim(),
        marks: c.marks,
        grade: calculateGrade(c.marks)
      });
      marksList.push(c.marks);
    }

    const student = new Student(item.id, item.name || 'Unknown', validatedCourses);
    student.average = calculateAverage(marksList);
    student.gpa = calculateGPA(validatedCourses);
    students.push(student);
  }

  return students;
}

export function generateReport(students) {
  const total = students.length;
  const avg = total ? Number((students.reduce((sum, s) => sum + s.average, 0) / total).toFixed(2)) : 0;

  return {
    totalStudents: total,
    classAverage: avg,
    students: students.map(s => ({
      id: s.id,
      name: s.name,
      courses: s.courses,
      average: s.average,
      gpa: s.gpa
    }))
  };
}

export function reportToJSON(report) {
  return JSON.stringify(report, null, 2);
}
