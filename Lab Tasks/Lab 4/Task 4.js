function applyToArgs(fn, args) {
  if (args.length === 0) return 0;
  if (args.length === 1) return fn(args[0]);
  return args.map(function (v) { return fn(v); });
}

function roundMe(...args) {
  return applyToArgs(Math.round, args);
}

console.log("Task 4");
console.log(roundMe());        
console.log(roundMe(4.7));     
console.log(roundMe(4.7, 4.4)); 