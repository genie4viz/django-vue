import {
    SUBMIT_MODIF,
    SUBMIT_CREATE,
    SUBMIT_DELETE,
    SUBMIT_DELETE_LOCATION,
    SUBMIT_PROFILE_MODIF
} from '../Actions/admin_actions.js'

export const extraUIReducer = (state, action) => {
    const uiBehaviours = {
        [SUBMIT_MODIF.SUCCESS](state) {
            return state.set('editing', null)
        },
        [SUBMIT_CREATE.SUCCESS](state) {
            return state.set('editing', null)
        },
        [SUBMIT_DELETE.SUCCESS](state) {
            return state.set('isModalOpen', false)
        },
        [SUBMIT_DELETE_LOCATION.SUCCESS](state) {
            return state.set('isModalOpen', false).set('editing', null)
        },
        [SUBMIT_PROFILE_MODIF.SUCCESS](state) {
            return state.set('editing', null)
        }
    }
    const uiBehaviour = uiBehaviours[action.type]
    return uiBehaviour ? uiBehaviour(state) : state
}