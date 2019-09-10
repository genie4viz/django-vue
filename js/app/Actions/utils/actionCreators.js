const REQUEST = "REQUEST";
const SUCCESS = "SUCCESS";
const FAILURE = "FAILURE";

export function createAsyncRequestType(prefix) {
    return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
        acc[type] = `${prefix}_${type}`;
        return acc;
    }, {})
}

export function createAction(type, payload = {}) {
    return {
        type,
        ...payload
    }
}
