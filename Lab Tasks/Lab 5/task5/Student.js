export default class Student {
  constructor(id, name, courses = []) {
    this.id = id;
    this.name = name;
    this.courses = courses;
    this.average = 0;
    this.gpa = 0.0;
  }

  getSummary() {
    return {
      id: this.id,
      name: this.name,
      coursesCount: this.courses.length,
      average: this.average,
      gpa: this.gpa
    };
  }
}
