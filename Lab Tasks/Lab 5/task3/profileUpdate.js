export function logNotes(...notes) {
  const [first = 'None', ...rest] = notes;
  return { first, rest };
}

export function updateStudentProfile(student, update = {}) {
  if (!student) return null;

  // Object destructuring with rest & renaming
  const {
    name: newName,
    marks: newMarks,
    scholarship: newScholarship,
    address: updateAddr = {},
    contact: updateContact = {},
    ...otherUpdates
  } = update;

  // Nested destructuring with aliases
  const { city: updatedCity, sector: updatedSector } = updateAddr;
  const { email: updatedEmail, phone: updatedPhone } = updateContact;

  // Nullish coalescing preserves 0, false, and empty string
  const name = newName ?? student.name;
  const marks = newMarks ?? student.marks;
  const scholarship = newScholarship ?? student.scholarship;

  // Deep merging using spread and optional chaining
  const address = {
    ...student.address,
    ...(updateAddr.city !== undefined ? { city: updatedCity } : {}),
    ...(updateAddr.sector !== undefined ? { sector: updatedSector } : {})
  };

  const contact = {
    ...student.contact,
    ...(updateContact.email !== undefined ? { email: updatedEmail } : {}),
    ...(updateContact.phone !== undefined ? { phone: updatedPhone } : {})
  };

  // Property shorthand
  return {
    ...student,
    name,
    marks,
    scholarship,
    address,
    contact,
    ...otherUpdates
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

console.log('Updated Student:');
console.log(updatedStudent);

console.log('\nReference Equality Check:');
console.log('student === updatedStudent:', student === updatedStudent);
console.log('Reason: updateStudentProfile creates a new root object using spread.');

console.log('student.address === updatedStudent.address:', student.address === updatedStudent.address);
console.log('Reason: A new address object was created to prevent mutating the original.');

console.log('student.contact === updatedStudent.contact:', student.contact === updatedStudent.contact);
console.log('Reason: A new contact object was created with the new phone field merged in.');

console.log('\nHelper test (rest & array destructuring):', logNotes('Profile updated', 'Verified'));
