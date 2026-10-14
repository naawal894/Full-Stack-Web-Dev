function createPhoneNumber(numbers) {
  let s = numbers.join("");
  return "(" + s.slice(0, 3) + ") " + s.slice(3, 6) + "-" + s.slice(6);
}

console.log("----- Task 3 -----");
console.log(createPhoneNumber([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])); // (123) 456-7890
