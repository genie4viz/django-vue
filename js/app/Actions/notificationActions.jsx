/**
 * Created by fbrousseau on 2016-06-13.
 */
import {createAsyncRequestType, createAction} from "./utils/actionCreators.js"

const createActions = prefix => {
    return ['SEND', 'DISMISS', 'CLEAR'].reduce((acc, type) => {
        acc[type] = `${prefix}_${type}`;
        return acc;
    }, {})
}

export const NOTIFICATION = createActions("NOTIFICATION")

export const notificationActions = {
    send: data => createAction(NOTIFICATION.SEND, {data: data}),
    dissmiss: id => createAction(NOTIFICATION.DISMISS, {id: id}),
    clear: () => createAction(NOTIFICATION.CLEAR)
}

export const notificationSend = obj => {
    const data = Object.assign({}, obj)

    if (!data.id) {
        data.id = Date.now()
    }

    return dispatch => {
        dispatch(notificationActions.send(data))

        if (data.timeout) {
            setTimeout(() => {
                dispatch(notificationActions.dissmiss(data.id))
            }, data.timeout)
        }
    }
}
