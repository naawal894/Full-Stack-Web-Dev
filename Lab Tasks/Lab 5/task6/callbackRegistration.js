// Why callbacks become hard to maintain:
// As asynchronous steps depend on each other, each step has to be nested inside the previous one.
// This creates "callback hell" (the pyramid of doom) which makes code hard to read and debug.
// Furthermore, every step requires its own repetitive error handling (if (err) return callback(err)),
// and you cannot use regular try/catch or clean return statements across asynchronous boundaries.
 
const students = {
  101: { id: 101, name: 'Sara Khan', completedCourses: ['CS101', 'CS201'], registeredCourses: [] },
  102: { id: 102, name: 'Ali Ahmed', completedCourses: ['CS101'], registeredCourses: [] },
  103: { id: 103, name: 'Usman Tariq', completedCourses: ['CS101', 'CS201'], registeredCourses: ['CS401'] }
};

const courses = {
  'CS401': { code: 'CS401', title: 'Web Development', prerequisite: 'CS201', totalSeats: 2, enrolled: 1 },
  'CS402': { code: 'CS402', title: 'Machine Learning', prerequisite: 'CS201', totalSeats: 1, enrolled: 1 }
};

export function loadStudent(id, callback) {
  setTimeout(() => {
    const student = students[id];
    if (!student) {
      return callback(new Error(`Student with ID ${id} not found.`));
    }
    callback(null, student);
  }, 30);
}

export function checkPrerequisites(student, courseCode, callback) {
  setTimeout(() => {
    const course = courses[courseCode];
    if (!course) {
      return callback(new Error(`Course ${courseCode} not found.`));
    }
    if (course.prerequisite && !student.completedCourses.includes(course.prerequisite)) {
      return callback(new Error(`Prerequisite ${course.prerequisite} not completed by ${student.name}.`));
    }
    callback(null, course);
  }, 30);
}

export function checkAvailableSeats(course, callback) {
  setTimeout(() => {
    if (course.enrolled >= course.totalSeats) {
      return callback(new Error(`Course ${course.code} is full.`));
    }
    callback(null, true);
  }, 30);
}

export function registerCourse(student, course, callback) {
  setTimeout(() => {
    if (student.registeredCourses.includes(course.code)) {
      return callback(new Error(`Student ${student.name} is already registered in ${course.code}.`));
    }
    callback(null, {
      studentId: student.id,
      course: course.code,
      status: 'REGISTERED'
    });
  }, 30);
}

export function runRegistration(studentId, courseCode, callback) {
  loadStudent(studentId, (err, student) => {
    if (err) return callback(err);

    checkPrerequisites(student, courseCode, (err, course) => {
      if (err) return callback(err);

      checkAvailableSeats(course, (err) => {
        if (err) return callback(err);

        registerCourse(student, course, (err, confirmation) => {
          if (err) return callback(err);
          callback(null, confirmation);
        });
      });
    });
  });
}

// Tests
const testCases = [
  { studentId: 101, courseCode: 'CS401', desc: 'Valid registration' },
  { studentId: 999, courseCode: 'CS401', desc: 'Student does not exist' },
  { studentId: 102, courseCode: 'CS401', desc: 'Prerequisite missing' },
  { studentId: 101, courseCode: 'CS402', desc: 'Course full' },
  { studentId: 103, courseCode: 'CS401', desc: 'Already registered' }
];

function runNext(index) {
  if (index >= testCases.length) return;
  const t = testCases[index];
  runRegistration(t.studentId, t.courseCode, (err, res) => {
    if (err) {
      console.log(`[Fail - ${t.desc}]:`, err.message);
    } else {
      console.log(`[Success - ${t.desc}]:`, res);
    }
    runNext(index + 1);
  });
}

runNext(0);
