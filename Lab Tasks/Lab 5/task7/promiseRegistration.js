// Task 7: Promise-Based Multi-Service Registration Engine

const students = {
  201: { id: 201, name: 'Sara Khan', completed: ['CS201'], enrolled: [] },
  202: { id: 202, name: 'Usman Tariq', completed: [], enrolled: [] }
};

const courses = {
  'CS401': { code: 'CS401', title: 'Web Development', prerequisite: 'CS201', totalSeats: 2, enrolled: 1 }
};

// Async operations returning Promises
export function getStudent(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const student = students[id];
      student ? resolve(student) : reject(new Error(`Student ${id} not found.`));
    }, 20);
  });
}

export function getCourse(code) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const course = courses[code];
      course ? resolve(course) : reject(new Error(`Course ${code} not found.`));
    }, 20);
  });
}

export function checkPrerequisites(student, course) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (course.prerequisite && !student.completed.includes(course.prerequisite)) {
        reject(new Error(`Missing prerequisite: ${course.prerequisite}`));
      } else {
        resolve({ student, course });
      }
    }, 20);
  });
}

export function checkSeats(context) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (context.course.enrolled >= context.course.totalSeats) {
        reject(new Error(`Course ${context.course.code} is full.`));
      } else {
        resolve(context);
      }
    }, 20);
  });
}

export function registerStudent(context) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        studentId: context.student.id,
        course: context.course.code,
        status: 'REGISTERED'
      });
    }, 20);
  });
}

// Notification services for Part B
export function sendEmail(reg) {
  return new Promise((resolve) => setTimeout(() => resolve(`Email sent to ${reg.studentId}`), 20));
}

export function sendSMS(reg) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('SMS gateway failed')), 20));
}

export function writeAuditLog(reg) {
  return new Promise((resolve) => setTimeout(() => resolve(`Audit logged for ${reg.course}`), 20));
}

// Part A: Sequential registration using Promise chaining
export function runRegistration(studentId, courseCode) {
  let currentStudent;

  return getStudent(studentId)
    .then(student => {
      currentStudent = student;
      return getCourse(courseCode);
    })
    .then(course => checkPrerequisites(currentStudent, course))
    .then(ctx => checkSeats(ctx))
    .then(ctx => registerStudent(ctx));
}

// Part B: Post-registration services using Promise.allSettled
export function notifyAll(reg) {
  return Promise.allSettled([
    sendEmail(reg),
    sendSMS(reg),
    writeAuditLog(reg)
  ]).then(results => [
    { service: 'Email', status: results[0].status },
    { service: 'SMS', status: results[1].status },
    { service: 'Audit', status: results[2].status }
  ]);
}

// Part C: Server redundancy with Promise.any
// Why Promise.any: We want the first *successful* response.
// If Server A fails fast (e.g. 500 error), Promise.race would fail immediately,
// while Promise.any ignores the rejection and waits for Server B's success.
function getServerA(code) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('Server A 500 error')), 10));
}

function getServerB(code) {
  return new Promise((resolve) => setTimeout(() => resolve(courses[code]), 30));
}

export function fetchCourseFastest(code) {
  return Promise.any([getServerA(code), getServerB(code)]);
}

// Execution and testing
async function run() {
  console.log('Part A: Running Registration Chain:');
  try {
    const reg = await runRegistration(201, 'CS401');
    console.log('Registration success:', reg);

    console.log('\nPart B: Post-Registration Services (Promise.allSettled):');
    const report = await notifyAll(reg);
    console.log(report);
  } catch (err) {
    console.log('Registration failed:', err.message);
  }

  console.log('\nTesting Chain Failure (missing prerequisite):');
  try {
    await runRegistration(202, 'CS401');
  } catch (err) {
    console.log('Caught error:', err.message);
  }

  console.log('\nPart C: Redundant Server Fetch (Promise.any):');
  try {
    const fastest = await fetchCourseFastest('CS401');
    console.log('Fetched successfully from:', fastest.title);
  } catch (err) {
    console.log('All servers failed:', err.message);
  }
}

run();
