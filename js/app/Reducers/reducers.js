/**
 * Created by fbrousseau on 2016-03-14.
 */
import {SHOWCASE, SEARCH_TRAILS} from "../Actions/actions.jsx"
import {PAGINATION, SET_PAGE, RESET_PAGE} from "../Actions/pagination_actions.jsx"
import * as Actions from "../Constants/constants.jsx";

export function reducer_showcase(state = {
    isLoading: false,
    data: [],
    error: false
}, action = null) {
    switch (action.type) {
        case SHOWCASE.FAILURE:
            return Object.assign({}, state, {isLoading: false, data: action.data, error: true});
        case SHOWCASE.SUCCESS:
            return Object.assign({}, state, {isLoading: false, data: action.data, error: false});
        case SHOWCASE.REQUEST:
            return Object.assign({}, state, {isLoading: true, error: false});
        default:
            return state;
    }
}


export function reducer_search(state = {
    page: 1,
    searchSubmitted: false,
    location: {
        isLoading: false,
        data: [],
        error: false
    },
    trail: {
        isLoading: false,
        data: [],
        error: false
    },
    poi: {
        isLoading: false,
        data: [],
        error: false
    }
}, action = null) {
    switch (action.type) {
        case SET_PAGE:
            return {...state, page: action.pageNum};
        case RESET_PAGE:
            return {...state, page: 1}
        case PAGINATION.REQUEST:
        case SEARCH_TRAILS.REQUEST:
            return {...state, trail: {...state.trail, isLoading: true}};
        case PAGINATION.SUCCESS:
        case SEARCH_TRAILS.SUCCESS:
            return {...state, searchSubmitted: true, trail: {...state.trail, isLoading: false, data: action.data, error: false}};
        case PAGINATION.FAILURE:
        case SEARCH_TRAILS.FAILURE:
            return {...state, searchSubmitted: true, isLoading: false, data: action.data, error: true};
        default:
            return state;
    }
}

// export function reducers_selected(state = {
//     selectedHike: {},
//     selectedPoi: {}
// }, action = null) {
//     switch (action.type) {
//         // case Actions.SELECT_HIKE_FROM_LIST:
//         //     return Object.assign({}, state, {selectedHike: action.hike});
//         case Actions.SELECT_POI_FROM_LIST:
//             return Object.assign({}, state, {selectedPoi: action.poi})
//         // case Actions.CLEAR_HIKE_FROM_LIST:
//         //     return Object.assign({}, state, {selectedHike: {}})
//         default:
//             return state;
//     }
// }

let Sport = {
    NONE: 0,
    RANDONNEE: 1,
    RAQUETTE: 2,
    RANDONNEE_HIVERNALE: 3,
    VELO_DE_MONTAGNE: 4,
    FATBIKE: 5,
    VELO: 6,
    SKI_DE_FOND: 7,
    EQUITATION: 8,
    ALL: 100
}

export function reducer_legend(state = {
    sport: Sport.ALL,
    poiVisibility: "2,3,7,58,11,16,18,64,71,28,57,42,44,80,33,4,8,9,68,19,67,25,27,70,32,40,39,74,46,75,47,48,50,51,77,78"
}, action = null) {
    switch(action.type){
        case Actions.SELECT_DYNAMIC_LAYER:
            return Object.assign({}, state, {sport: action.value})
        case Actions.POI_LEGEND_CHANGE:
            let sport = Sport.NONE;
            switch(action.data.sport.toString()){
                case "1": case "Randonnée":         sport = Sport.RANDONNEE;           break;
                case "2": case "Raquette":          sport = Sport.RAQUETTE;            break;
                case "3":                           sport = Sport.RANDONNEE_HIVERNALE; break;
                case "4":                           sport = Sport.VELO_DE_MONTAGNE;    break;
                case "5":                           sport = Sport.FATBIKE;             break;
                case "6":                           sport = Sport.VELO;                break;
                case "7":                           sport = Sport.SKI_DE_FOND;         break;
                case "8":                           sport = Sport.EQUITATION;          break;
                case "100": case "Tous les sports": sport = Sport.ALL;                 break;
            }
            return Object.assign({}, state, {poiVisibility: action.data.poiVisibility, sport: sport});
        default:
            return state;
    }
}

export {
    Sport
}
