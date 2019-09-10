import React from "react";
import expect from "expect";
import { shallow, mount } from "enzyme"

import { ProfileLoggedIn, ProfileLoggedOut } from "../../Components/profile_components/profileWidget.jsx"

import { setup } from "../setup.js"

var ReactTestUtils = require("react-addons-test-utils")


describe("Logged in and logged out UI", function() {
  it("should display anonymous photo when logged out", function() {
      const { actions, props } = setup()
      const component = shallow(<ProfileLoggedOut 
        login = { actions.login }
        loginSocial = { actions.loginSocial } {...props }
        />
      )

    let img = component.find(".profile-widget__img--default")
    expect(img).toExist()
    expect(img.hasClass("profile-widget__img--default")).toEqual(true);
  })

  it("should call log in action on click", function() {
      const { actions, props } = setup()
      const component = shallow(<ProfileLoggedOut 
        login = { actions.login } 
        {...props }
        />)
        component.find("a").simulate("click", { preventDefault() {} }); expect(actions.login).toHaveBeenCalled;
      })
})