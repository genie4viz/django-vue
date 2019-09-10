import React, {PropTypes} from "react"
import classNames from "classnames"
import debounce from "lodash/debounce"

const defaultProps = {
    action: null,
    actionPostion: 'right',
    fluid: false,
	onInputChange: () => {}
}

const propTypes = {
    action: PropTypes.element,
    actionPosition: PropTypes.string,
    fluid: PropTypes.bool,
	onInputChange: PropTypes.func.isRequired,
}



export const FuzzyFilter = props => {
    const {
        action, 
        actionPosition, 
        fluid, 
        onInputChange,
        items,
        collection,
    } = props
    let classes = classNames(
        'ui', 
        actionPosition, 
        {fluid, 'action': action},
        'input')
	return (
		<div className="fuzzy-filter">
			<div className="fields">
				<div className="field">
					<div className={classes}>
						<input type="text" placeholder="Recherchez..." onChange={onInputChange}/>
                        {action}
					</div>
				</div>
			</div>
		</div>
	)
}

FuzzyFilter.defaultProps = defaultProps
FuzzyFilter.propTypes = propTypes
