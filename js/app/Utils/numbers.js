export const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

/**
 * Genereate a random integer between a specified range
 * @param  {number} min The starting number of the range
 * @param  {number} max The ending number of the range
 * @return {integer}     The generated integer
 */
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

/**
 * Method override to convert degrees to radian
 * @return {number} The converted number
 */
Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
}