export class Person {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  introduce() {
    return `Hi, I am ${this?.name || 'Unknown'} (${this?.email || 'No email'}).`;
  }
}

export class Student extends Person {
  constructor(name, email, rollNo, marks) {
    super(name, email);
    this.rollNo = rollNo;
    this.marks = marks;
  }

  introduce() {
    return `${super.introduce()} I am a student with Roll No: ${this.rollNo}.`;
  }

  getResult() {
    return this.marks >= 50 ? 'Pass' : 'Fail';
  }
}

export class FacultyMember extends Person {
  constructor(name, email, employeeId, department) {
    super(name, email);
    this.employeeId = employeeId;
    this.department = department;
  }

  introduce() {
    return `${super.introduce()} I am faculty in ${this.department} [ID: ${this.employeeId}].`;
  }
}

const s1 = new Student('Sara Khan', 'sara@au.edu.pk', '2022-CS-101', 89);
const s2 = new Student('Usman Tariq', 'usman@au.edu.pk', '2022-SE-204', 45);
const f1 = new FacultyMember('Dr. Asim', 'asim@au.edu.pk', 'FAC-401', 'CS');
const f2 = new FacultyMember('Prof. Ayesha', 'ayesha@au.edu.pk', 'FAC-508', 'AI');

const users = [s1, s2, f1, f2];

console.log('Polymorphism (users.forEach):');
users.forEach(u => console.log(u.introduce()));

console.log('\nStudent Results:');
console.log(`${s1.name}:`, s1.getResult());
console.log(`${s2.name}:`, s2.getResult());

console.log('\nInstanceof Checks:');
console.log('s1 instanceof Student:', s1 instanceof Student);
console.log('s1 instanceof Person:', s1 instanceof Person);
console.log('f1 instanceof FacultyMember:', f1 instanceof FacultyMember);
console.log('f1 instanceof Student:', f1 instanceof Student);

// call(), bind(), and detached method challenge
const guest = { name: 'Dr. Ahmed', email: 'ahmed@example.com' };

console.log('\nUsing call() with guest:');
console.log(Person.prototype.introduce.call(guest));

console.log('\nDetaching student introduce:');
const detachedFn = s1.introduce;
try {
  detachedFn();
} catch (err) {
  console.log('Detached call threw error:', err.message);
  console.log('Reason: In strict mode (ES modules), detached functions lose "this" context (this becomes undefined).');
}

console.log('\nUsing bind():');
const boundFn = s1.introduce.bind(s1);
console.log(boundFn());
