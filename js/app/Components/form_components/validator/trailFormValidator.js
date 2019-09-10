import * as CONSTANTS from '../constants/constants';
import { not } from "../../../Utils/boolean.js"

export const validate = values => {
    let errors = {}

    if (not(values.name)) errors.name = CONSTANTS.REQUIRED

    if (not(values.location)) errors.location = CONSTANTS.REQUIRED
    
    if (not(values.region)) errors.region = CONSTANTS.REQUIRED

    if (not(values.activities)) errors.activities = CONSTANTS.REQUIRED

    if (not(values.description)) errors.description = CONSTANTS.REQUIRED

    return errors
}
