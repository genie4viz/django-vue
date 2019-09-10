import {createSelector} from 'reselect'

/**
 * ADMIN SELECTOR
 */
const adminItemCollectionSelector = (state, collection, id) => state.user[collection].find(item => item.id === id)

export const itemSelector = createSelector(
    adminItemCollectionSelector,
    item => item
)