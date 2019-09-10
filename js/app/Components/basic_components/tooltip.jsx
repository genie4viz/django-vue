import React, {Component, PropTypes} from "react"
import classNames from "classnames"

export class Tooltip extends Component {
  static propTypes = {
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]).isRequired,
    children: PropTypes.element.isRequired,
    position: PropTypes.string,
  }

  static defaultProps = {
    position: "right"
  }

  constructor(props) {
    super(props)

    this.state = {
      hover: false
    }
  }

  handleMouseEnter() {
    this.setState({hover: true})
  }

  handleMouseLeave() {
    this.setState({hover: false})
  }

  render() {
    let tooltipStyle = classNames(
      'tooltip',
      `tooltip--${this.props.position}`,
      {'tooltip--open': this.state.hover}
    )

    return (
      <span>
        <span
          className={tooltipStyle}
          >
          {this.props.content}
        </span>
        {React.cloneElement(this.props.children, {onMouseEnter: this.handleMouseEnter.bind(this), onMouseLeave: this.handleMouseLeave.bind(this)})}
      </span>
    )
  }
}
