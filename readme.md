1. What is the difference between var, let, and const?
var: Function-scoped. Can be redeclared and updated. Hoisted to the top of its scope. Not recommended in modern JS.
let: Block-scoped ({}). Can be updated but not redeclared in the same scope. Preferred for variables that will change.
const: Block-scoped. Cannot be updated or redeclared. Must be initialized at declaration. Used for values that should remain constant (like API base URLs or function expressions).
2. What is the spread operator (...)?
It allows an iterable (like an array or object) to be expanded into individual elements. Commonly used to copy arrays/objects or combine them.
3. What is the difference between map(), filter(), and forEach()?
All three are array methods used for iteration.
forEach(): Executes a provided function once for each array element. It does not return a new array. Used for performing an action (like console.log) on each item.
map(): Creates a new array populated with the results of calling a provided function on every element. Used for transforming data.
filter(): Creates a new array with all elements that pass a test implemented by a provided function. Used for selecting a subset of data.
4. What is an arrow function?
A shorter syntax for writing function expressions. It does not have its own this, arguments, super, or new.target. Arrow functions are best for non-method functions and cannot be used as constructors.
5. What are template literals?
Template literals are string literals allowing embedded expressions. They are enclosed by backticks (``) instead of quotes.