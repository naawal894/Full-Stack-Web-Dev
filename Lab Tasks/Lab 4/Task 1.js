
var fullName = "Nawal Fateh";          
var age = 21;                       
var isStudent = true;               
var university = "Air  University";
var hobby = "Coding";

console.log("Task 1: Biography");
console.log("My name is " + fullName + ". I am " + age + " years old.");
console.log("Student: " + isStudent + ", University: " + university);
console.log("Hobby: " + hobby);

var bio = {
  name: "Nawal Fateh",
  age: 21,
  email: "nawal@example.com",
  hobbies: "Coding",
  address: {
    street: "Street 5, Sector F-10",
    city: "Islamabad",
    country: "Pakistan"
  },
  degreeProgram: {
    title: "BS Computer Science",
    semester: 5,    
    cgpa: 3.4
  }
};

console.log("Task 1: Biography (object) ");
console.log("Name: " + bio.name);
console.log("Age: " + bio.age);
console.log("Email: " + bio.email);
console.log("Hobbies: " + bio.hobbies);
console.log("Address: " + bio.address.street + ", " + bio.address.city + ", " + bio.address.country);
console.log("Degree: " + bio.degreeProgram.title + " (Semester " + bio.degreeProgram.semester +
            ", CGPA " + bio.degreeProgram.cgpa + ")");
