// Task 3: Safe Student Profile Update Service

// Demonstrates rest parameters and array destructuring
export function logNotes(...notes) {
  const [first = 'None', ...rest] = notes;
  return { first, rest };
}

export function updateStudentProfile(student, update = {}) {
  if (!student) return null;

  // Destructure update fields with nullish coalescing to safely preserve 0 and false
  const { name, marks, scholarship, address: newAddr = {}, contact: newContact = {} } = update;

  return {
    ...student,
    name: name ?? student.name,
    marks: marks ?? student.marks,
    scholarship: scholarship ?? student.scholarship,
    // Safely merge nested objects using spread
    address: {
      ...student.address,
      ...newAddr
    },
    contact: {
      ...student.contact,
      ...newContact
    }
  };
}

const student = { 
  id: 101, 
  name: 'Ali', 
  marks: 0, 
  scholarship: false, 
  address: { city: 'Islamabad', sector: 'F-10' },
  contact: { email: 'ali@university.edu' }
};

const update = { 
  name: 'Ali Khan', 
  address: { city: 'Rawalpindi' },
  contact: { phone: '03001234567' }
};

const updatedStudent = updateStudentProfile(student, update);

console.log('Original Student:');
console.log(student);

console.log('\nUpdated Student:');
console.log(updatedStudent);

console.log('\nReference Equality Check:');
console.log('student === updatedStudent:', student === updatedStudent);
console.log('student.address === updatedStudent.address:', student.address === updatedStudent.address);
console.log('student.contact === updatedStudent.contact:', student.contact === updatedStudent.contact);

console.log('\nRest & Array Destructuring Demo:');
console.log(logNotes('Profile updated', 'Verified'));
