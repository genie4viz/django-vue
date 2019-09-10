import React, {Component, PropTypes} from "react";

import classNames from "classnames";

import {Observable} from "../../Utils/misc";

//Must declare whether an accordion is first-level or second level
//This decides the style and first-time rendering of the component
export class Accordion extends Component {

  static propTypes = {
      defaultOpenedItem: PropTypes.number
  }

  static defaultProps = {
      defaultOpenedItem: null
  }

  constructor(props) {
      super(props);
      this.state = {
        activeItem: null
      } ;
      this.toggleItemOpening = this.toggleItemOpening.bind(this);
      this.handleSearchClick = this.handleSearchClick.bind(this);
  }

  toggleItemOpening(id) {
    this.state.activeItem === id ? this.setState({activeItem: null}) : this.setState({activeItem: id});
  }

  handleSearchClick(id) {
    const {modifiedStyle} = this.props;
    if (modifiedStyle === 'first-level') {
      this.setState({activeItem: id});
    }
  }

  renderAccordionItem () {

    const cloneItem = (child, i) => React.cloneElement(child, {
      key: i,
      itemId: i,
      activeItem: this.state.activeItem,
      toggleItemOpening: this.toggleItemOpening
    });

    return this.props.children.map(cloneItem);
  }

  componentDidMount() {
    const {modifiedStyle, children, defaultOpenedItem} = this.props;

    if (defaultOpenedItem) {
      this.setState({activeItem: defaultOpenedItem})
    }

    if (modifiedStyle !== 'first-level' || undefined) {
      this.setState({activeItem: null});
    }

    Observable.addListener("OPEN_RESULT_LIST", this.handleSearchClick);
  }

  componentWillUnmount() {
    Observable.removeListener("OPEN_RESULT_LIST", this.handleSearchClick);
  }

  render() {
    const {modifiedStyle} = this.props;

    var styles = classNames(
      'accordion-menu',
      'accordion-menu--' + modifiedStyle
    );

    return (
      <div className={styles}>
        {this.renderAccordionItem()}
      </div>
    )
  }
}

export class AccordionItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {itemId, activeItem, modifiedStyle, modifiedItemStyle, toggleItemOpening} = this.props;
    var accordionItemStyle = classNames(
      'accordion',
      'accordion__content',
      {'accordion__content--active': itemId === activeItem ? true : false},
    )

    var accordionItemTitleStyle = classNames(
      'accordion',
      'accordion__title',
      {[`ripple--${modifiedItemStyle}`]: modifiedItemStyle},
      {[`accordion__title--${modifiedStyle}`]: modifiedStyle}
    );

    return (
      <div>
        <h3 className={accordionItemTitleStyle} onClick={() => toggleItemOpening(itemId)}>{this.props.title}</h3>
        <div className={accordionItemStyle}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
