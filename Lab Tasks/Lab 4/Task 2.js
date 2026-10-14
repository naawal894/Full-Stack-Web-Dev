function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function nextPrime(p) {
  let candidate = p + 1;
  while (!isPrime(candidate)) {
    candidate++;
  }
  return candidate;
}

let givenPrime = 11; // hardcoded
console.log("----- Task 2 -----");
console.log("Prime after " + givenPrime + " is " + nextPrime(givenPrime));
