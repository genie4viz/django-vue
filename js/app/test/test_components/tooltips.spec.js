import React from "react"
import expect from "expect"
import {shallow} from "enzyme"

import {Tooltip} from '../../Components/basic_components/tooltip.jsx'

describe("Tooltip component", function() {
  it("Should display a tooltip on mouseEnter", function () {
    const tooltip = shallow(
      <Tooltip
        content={<div>Hello!</div>}
        >
        <i/>
      </Tooltip>
    )
    tooltip.find('i').simulate('mouseEnter')
    expect(tooltip.state().hover).toBe(true)
  })
})
