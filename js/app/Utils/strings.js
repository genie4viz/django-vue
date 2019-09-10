/**
 * Get a substring between a string delimiter
 * @param  {string} str   The string to get the substring from
 * @param  {string} delim The string delimiter (e.g. ".")
 * @return {string}       The substring between the two delimiter
 */
export function getSubStr(str, delim) {
    var a = str.indexOf(delim);

    if (a == -1)
       return "";

    var b = str.indexOf(delim, a+1);

    if (b == -1)
       return "";

    return str.substr(a+1, b-a-1);
    //                 ^    ^- length = gap between delimiters
    //                 |- start = just after the first delimiter
}