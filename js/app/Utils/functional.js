// Curry function to arrity of one
const curry = (func, ...args) =>  (args.length >= func.length) ? func(...args) : (...next) => curry(func, ...args, ...next)

// Prints a trace of the data
export const trace = curry((label, x) => {
    console.log(`== ${ label }:  ${ x }`)
    return x;
})

// Partial application of function arguments
export const partial = fn => (...args) => fn.bind(null, ...args)

// Compose functions according to the mathematical concept of functional composition (inside out) Ex. f(x) . g(x) = f(g(x))
export const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)

// Compose functions from left to right
export const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

// Memoize functions
export const memoize = func => {
  let memo = {}, slice = Array.prototype.slice
  
  return () => {
    let args = slice.call(arguments)
    
    return (args in memo) ? memo[args] : (memo[args] = func.apply(this, args))
  }
}

export default curry