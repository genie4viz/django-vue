export const getTrailDifficulty = difficulty => {
    switch (difficulty) {
        case 1:
            return "Débutant";
        case 2:
            return "Modéré";
        case 3:
            return "Intermédiaire";
        case 4:
            return "Soutenu";
        case 5:
            return "Exigeant";
        default:
            return "Niveau non disponible";
    }
}

export const getPathType = type => {
    switch (type) {
        case 1:
            return "Aller simple";
        case 2:
            return "Boucle";
        case 3:
            return "Aller-retour";
        default:
            return "Indéterminé";
    }
}

export const getSportsType = type => {
    switch (type) {
        case 1:
            return "Randonnée"
        case 2:
            return "Raquette"
        case 3:
            return "Randonnée hivernale"
        case 4:
            return "Vélo de montagne"
        case 5:
            return "Fatbike"
        case 6:
            return "Vélo"
        case 7:
            return "Ski de fond"
        case 8:
            return "Équitation"
        default:
            return "Non déterminé"
    }
}

export const getDistance = total_length => {
    let value = `${(total_length/1000).toFixed(2)}km`
    return value
}

export const getDuration = duration => {
    let [hours, minutes] = duration.split(':')

    hours = parseInt(hours)
    minutes = parseInt(minutes)

    if(minutes === 0) {
      minutes = '00'
    } else if (minutes > 0 && minutes <= 29) {
      minutes = 30
    } else if (minutes >= 31 && minutes <= 59) {
      hours = hours + 1;
    }

    return `${hours}h${minutes}`
}

export const checkIfUndefined = func => (value, message = "-") => {
    if (func === undefined) {
        return value ? value : message
    }
    return value ? func(value) : message
}

// this util function is used for admin panel trail section page
// To change the locations array in the user state into an array that can be used for api call
export const parseAdminLocations = (arr) => {
    let newArr = [];
    for (var i = 0; i < arr.length; i++) {
        newArr.push(arr[i]["id"])
    }
    return newArr
}
