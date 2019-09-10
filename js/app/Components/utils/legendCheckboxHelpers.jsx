import poi from './poiLists.js'

//this function makes an array out of keys inside each poi category
function getArrays(map) {
    var arr = [];

    for (var key of map.keys()) {
        arr.push(key);
    }
    return arr
}

//these const below are for the local state of legend component
export const heberRestPoiItems = getArrays(poi['Hébergement / restaurant'])
export const activityPoiItems = getArrays(poi['Activité'])
export const autrePoiItems = getArrays(poi['Autre'])
export const parkingPoiItem = getArrays(poi['Stationnement'])


//the following function helps to make new value for the local state in legend component

//select single checkbox
export const getNewState = (currentState, checkbox) => {
  var newState = [];
  newState = newState.concat(currentState)

  if (currentState.indexOf(checkbox) < 0) {
    newState.push(checkbox)
  } else {
    var index = currentState.indexOf(checkbox);
    newState.splice(index, 1)
  }
  return newState
}
