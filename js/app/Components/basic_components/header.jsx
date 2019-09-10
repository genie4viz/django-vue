import React, {Component, PropTypes} from "react"
import {Link} from "react-router"
import classNames from "classnames"

import PageNav from "../basic_components/pageNav.jsx"
import SearchForm from "../form_components/searchForm.jsx"

import {SITE_PATH} from "../../config.jsx"

export class Header extends Component {
    static propTypes = {
        location: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.element,
        ]).isRequired,
    }

    constructor(props) {
        super(props)
        this.docElem = null
        this.header = null
        this.didScroll = false
        this.changeHeaderOn = 15
    }

    componentDidMount() {
        this.docElem = document.documentElement
        this.header = document.querySelector( ".hk-header" )

        window.addEventListener("scroll", this._handleScroll, false)
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll)
    }

    render() {
        const {location} = this.props
        const headerStyle = classNames('hk-header', {
            'hk-header--inverted': location.includes('/admin/'),
            'hk-header--removable': location.includes('/locations/') || location.includes('/hikes/'),
            'hk-header--results': location.includes('/results/')
        })
        return (
            <header className={headerStyle}>
                <div className="hk-header__inner">
                    <div className="hk-header__logo">
                        <Link to={SITE_PATH}><img id="logo-img" src={`/static/img/logo-Blanc-300.png`} alt=""/></Link>
                    </div>
                    <nav className="hk-header__nav">
                        {this.props.children}
                    </nav>
                </div>
                <div className="hk-header__search">
                    <SearchForm location={this.props.location} autoSearch={true} />
                </div>
            </header>
        )
    }

    _handleScroll = (event) => {
        if( !this.didScroll ) {
            this.didScroll = true
            setTimeout(this._scrollPage, 250)
        }
    }

    _scrollPage = () => {
        const sy = window.pageYOffset || this.docElem.scrollTop
        if ( sy >= this.changeHeaderOn ) {
            classie.add(this.header, "hk-header--shrink")
        } else {
            classie.remove(this.header, "hk-header--shrink")
        }
        this.didScroll = false
      }
}
