import React, {Component, Proptypes} from "react"
import expect from 'expect'

import {admin_user_reducer} from "../../Reducers/admin_user_reducer.js"
import {orderCollection} from "../../Actions/admin_actions.js"

describe("User admin reducer", () => {
    const mockInitialState = {
        isLoading: false,
        error: false,
        profile: null,
        trails: [
            {location_name: "Pain-de-sucre", last_modified: "2017-03-13"},
            {location_name: "Rocky - Trajet 1", last_modified: "2017-03-01"},
            {location_name: "Du Ruisseau", last_modified: '2017-03-01'}
        ],
        locations: null,
        admins: null,
    }

    it('should return the trails ordered by asc dates', () => {
        let ordered = admin_user_reducer(mockInitialState, orderCollection('trails', 'last_modified', 'ASC'))

        expect(ordered.trails[0]) // Check that the first is the lowest date
            .toEqual({location_name: "Rocky - Trajet 1", last_modified: "2017-03-01"})
        expect(ordered.trails[ordered.trails.length - 1]) // Check that the first is the lowest date
            .toEqual({location_name: "Pain-de-sucre", last_modified: "2017-03-13"})
    })

    it('should return the trails ordered by descending dates', () => {
        let action = orderCollection('trails', 'last_modified', 'DESC')
        let ordered = admin_user_reducer(mockInitialState, action)
        expect(ordered.trails[0])
            .toEqual({location_name: "Pain-de-sucre", last_modified: "2017-03-13"})
    })
})