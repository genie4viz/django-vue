export function scrollToFirstError(errors) {
  const errorFields = getErrorFieldNames(errors);
  // console.log('errorFields: ', errorFields)
  for (let i = 0; i < errorFields.length; i++) {
    const fieldName = `position-${errorFields[i]}`;
    document.getElementById(fieldName).scrollIntoView();
    break;
  }
}

function getErrorFieldNames(obj, name = '') {
  const errorArr = [];
  errorArr.push(Object.keys(obj));
  return flatten(errorArr);
}

function flatten(arr) {
  return arr.reduce((flat, toFlatten) => flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), []);
}
