import React, {Component, PropTypes} from "react"
import Immutable from "immutable"

import {not} from "../../Utils/boolean.js"

/**
 * Profile header stateless component
 * @param  {object} props Header for profile page. Mirrors normal hero component but with different background
 * @return {react-component}       react stateless component
 */
export const ProfileHeader = ({first_name, last_name, address, profile_picture}) => {
    let addressTag = <h2 className="profile-header__subtitle">{`${address.city}, ${address.province}, ${address.country}`}</h2>

    // if (Object.values(address).includes(null)) {
    //     addressTag = <h2 className="profile-header__subtitle"></h2>
    // } else {
    //     addressTag = <h2 className="profile-header__subtitle">{`${city}, ${province}, ${country}`}</h2>
    // }

    return (
        <div className="profile-header">
            <div className="profile-header__wrapper">
                <div className="profile-header__info">
                    <h1 className="profile-header__title">{`${first_name} ${last_name}`}</h1>
                    {addressTag}
                </div>
                <div className="profile-header__avatar">
                    <img className="ui small circular image" src={profile_picture} alt=""/>
                </div>
            </div>
        </div>
    )
}
