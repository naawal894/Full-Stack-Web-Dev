function applyToArgs(fn, args) {
  if (args.length === 0) return 0;
  if (args.length === 1) return fn(args[0]);
  return args.map(function (v) { return fn(v); });
}

function abs(...args)   { return applyToArgs(Math.abs, args); }
function ceil(...args)  { return applyToArgs(Math.ceil, args); }
function floor(...args) { return applyToArgs(Math.floor, args); }

console.log("----- Task 5 -----");
console.log(abs(), abs(-5.2), abs(-5.2, 3, -1));       // 0 5.2 [ 5.2, 3, 1 ]
console.log(ceil(), ceil(4.1), ceil(4.1, -2.5));       // 0 5 [ 5, -2 ]
console.log(floor(), floor(4.9), floor(4.9, -2.5));    // 0 4 [ 4, -3 ]


