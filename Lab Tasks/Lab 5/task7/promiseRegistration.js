const students = {
  201: { id: 201, name: 'Sara Khan', completed: ['CS201'], enrolled: [] },
  202: { id: 202, name: 'Usman Tariq', completed: [], enrolled: [] },
  203: { id: 203, name: 'Ahmed Ali', completed: ['CS201'], enrolled: ['CS401'] }
};

const courses = {
  'CS401': { code: 'CS401', title: 'Web Development', prerequisite: 'CS201', totalSeats: 2, enrolled: 1 },
  'CS402': { code: 'CS402', title: 'Data Mining', prerequisite: 'CS201', totalSeats: 1, enrolled: 1 }
};

export function getStudent(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const s = students[id];
      s ? resolve(s) : reject(new Error(`Student ${id} not found.`));
    }, 20);
  });
}

export function getCourse(code) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const c = courses[code];
      c ? resolve(c) : reject(new Error(`Course ${code} not found.`));
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
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { student, course } = context;
      if (student.enrolled.includes(course.code)) {
        reject(new Error(`Already registered in ${course.code}.`));
      } else {
        resolve({
          studentId: student.id,
          course: course.code,
          status: 'REGISTERED'
        });
      }
    }, 20);
  });
}

export function sendEmail(reg) {
  return new Promise((resolve) => setTimeout(() => resolve(`Email sent for ${reg.studentId}`), 20));
}

export function sendSMS(reg) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('SMS service unavailable')), 30));
}

export function writeAuditLog(reg) {
  return new Promise((resolve) => setTimeout(() => resolve(`Audit logged for ${reg.course}`), 10));
}

// Part A: Chained registration
export function runRegistration(studentId, courseCode) {
  return getStudent(studentId)
    .then(student => {
      return getCourse(courseCode).then(course => ({ student, course }));
    })
    .then(ctx => checkPrerequisites(ctx.student, ctx.course))
    .then(ctx => checkSeats(ctx))
    .then(ctx => registerStudent(ctx));
}

// Part B: Post-registration with Promise.allSettled
export function notifyAll(reg) {
  const tasks = [
    sendEmail(reg).then(() => 'fulfilled').catch(() => 'rejected'),
    sendSMS(reg).then(() => 'fulfilled').catch(() => 'rejected'),
    writeAuditLog(reg).then(() => 'fulfilled').catch(() => 'rejected')
  ];

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

// Part C: Server selection with Promise.any
// Why Promise.any: We want the first *successful* response.
// If Server A fails fast (e.g. 500 error in 10ms), Promise.race would fail immediately.
// Promise.any ignores the rejection and waits for Server B's successful response.
function getServerA(code) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('Server A 500 Error')), 15));
}

function getServerB(code) {
  return new Promise((resolve) => setTimeout(() => resolve(courses[code]), 35));
}

export function fetchCourseFastest(code) {
  return Promise.any([getServerA(code), getServerB(code)]);
}

// Execution
async function demo() {
  console.log('Part A: Registration Chain');
  runRegistration(201, 'CS401')
    .then(async reg => {
      console.log('Registration Success:', reg);

      console.log('\nPart B: Post-Registration Services (Promise.allSettled)');
      const report = await notifyAll(reg);
      console.log(report);
    })
    .catch(err => {
      console.log('Registration Error:', err.message);
    })
    .finally(() => {
      console.log('Registration flow finished.');
    });

  // Test failure
  setTimeout(() => {
    console.log('\nTesting Chain Failure:');
    runRegistration(202, 'CS401')
      .catch(err => console.log('Expected chain failure caught:', err.message));
  }, 150);

  // Test Part C
  setTimeout(async () => {
    console.log('\nPart C: Fetch from redundant servers using Promise.any()');
    try {
      const course = await fetchCourseFastest('CS401');
      console.log('Course received from fastest working server:', course.title);
    } catch (err) {
      console.log('Both servers failed:', err.errors);
    }
  }, 250);
}

demo();
