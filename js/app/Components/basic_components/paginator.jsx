/**
 * Created by fbrousseau on 2016-08-01.
 */
import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import classNames from "classnames";

const mapStateToProps = state => {
    return {
        page: state.search.page
    }
}

export class Paginator extends Component {
    static propTypes = {
        next: PropTypes.any,
        nextPage: PropTypes.func,
        number_of_pages: PropTypes.number,
        page: PropTypes.number.isRequired,
        prev: PropTypes.any,
        previousPage: PropTypes.func
    }

    static defaultProps = {
        style: {}
    }

    constructor(props) {
        super(props);
    }

    onClickNext() {
        //check if there's a next page
        const {nextPage, next, number_of_pages, page} = this.props;

        if (next && page <= number_of_pages) {
            nextPage(page + 1, next);
        }
    }

    onClickPrev() {
        const {previousPage, page, prev} = this.props;

        if (prev && page > 0) {
            previousPage(page - 1, prev);
        }
    }

    render() {
        const {next, number_of_pages, page, prev, style} = this.props;

        let prevDisabled = classNames({
            "ui button": prev,
            "ui disabled button": !prev || number_of_pages === undefined
        })

        let nextDisabled = classNames({
            "ui button": next,
            "ui disabled button": !next || number_of_pages === undefined
        })

        return (
            <div className="paginator tiny ui buttons">
                <button className={prevDisabled} onClick={this.onClickPrev.bind(this)}>
                    <i className="icon-Gauche"></i>
                    &nbsp;Précédent
                </button>
                <div className="or" data-text={page}></div>
                <button className={nextDisabled} onClick={this.onClickNext.bind(this)}>
                    Suivant&nbsp;
                    <i className="icon-Droite"></i>
                </button>
            </div>
        );
    }
}

Paginator = connect(mapStateToProps)(Paginator)
