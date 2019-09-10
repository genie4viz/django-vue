import React, {Component} from "react"
import { Sticky } from "../basic_components/sticky.jsx"

export default class PageNav extends Component {

    constructor(props) {
      super(props)
      this.didScroll = false
      this.state = { sectionElements: [], activeItem: 0}
    }

    componentDidMount() {
      //select all section element except the first one (hero)
      let sectionElements = [...document.querySelectorAll("section")]
      sectionElements.splice(0, 1)

      this.setState({ sectionElements: sectionElements})

      window.addEventListener("scroll", this._handleScroll)
    }

    componentWillUnmount() {
      window.removeEventListener("scroll", this._handleScroll)
    }

    render() {

      return (
          <div className="pagenav">
            <Sticky className="pagenav">
              <ul id="pagenav">
                  {this.state.sectionElements.map( (element, idx) => <a key={idx} onClick={ (e) => this._handleClick(e, this.state.sectionElements[idx], idx)} className={this.state.activeItem == idx ? "activePagenavItem" : ""}><li>{element.dataset.pagenavName}</li></a> )}
              </ul>
            </Sticky>
          </div>
      )
    }

    _handleClick = (e, element, idx) => {
      this.setState({ activeItem: idx})
      let y = document.getElementById(element.id).offsetTop - 50
      window.scrollTo(0, y)

      e.stopPropagation();
    }

    _handleScroll = (event) => {
        if( !this.didScroll ) {
            this.didScroll = true
            setTimeout(this._scrollHighlight, 250)
        }
    }

    _scrollHighlight = () => {

      this.state.sectionElements.map( (item, idx) => {

        //scroll position
        let scrollPosition = item.scrollTop

        let elmtToTop = item.getBoundingClientRect()['top']

        let elmtHeight = item.offsetHeight

        if(elmtToTop <= scrollPosition + 50 && elmtToTop + elmtHeight > scrollPosition) {
            this.setState({activeItem: idx})
        }
      })

      this.didScroll = false
    }

}
