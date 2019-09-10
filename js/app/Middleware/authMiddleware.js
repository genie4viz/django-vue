import axios from "axios"
import _ from "lodash"

const authRequest = getState => next => action => {
    authed = getState().authed

    if (!(_.isEmpty(authed))) {
        axios.defaults.common[Token] = `JWT ${accessToken}`
    }
    next(action)
}

export default authRequest
