import expect from "expect"

var jsdom = require("jsdom")

global.document = jsdom.jsdom("<!doctype html><html><body></body></html>")
global.window = document.defaultView
global.navigator = global.window.navigator


export function setup(accessToken = false) {
  let actions = {
    login: expect.createSpy(),
    logout: expect.createSpy(),
    loginSocial: expect.createSpy(),
  }

  let props = {
    authed: {
      accessToken: accessToken,
      user: {
        isLoading: false,
        error: false,
        data: {}
      }
    },
    location : {
      pathname: "/"
    },
    ui: {
      isProfileMenuOpen: false
    },
    toggleMenu: expect.createSpy()
  }

  return {
    actions,
    props
  }
}
