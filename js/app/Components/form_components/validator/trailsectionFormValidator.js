import { not } from "../../../Utils/boolean.js"
import * as CONSTANTS from '../constants/constants';


export const validate = (values) => {

  let errors = {}

  if(not(values.activity)) values.activity=[0]

  if (not(values.name)) errors.name = CONSTANTS.REQUIRED

  return errors

}
