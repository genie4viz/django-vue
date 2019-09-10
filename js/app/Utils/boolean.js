/**
 * Function to negate an expression more explicitly
 * @param  {bool} expression boolean expression
 * @return {bool}            negated expression
 */
export function not(expression) {
    return !expression
}

export function and(expression1, expression2) {
    return expression1 && expression2
}

export function or(expression1, expression2) {
    return expression1 || expression2
}


export function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}