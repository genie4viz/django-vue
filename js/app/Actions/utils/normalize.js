// Normalize contextual
import {not} from "../../Utils/boolean.js"

export const normalizeFormData = formData => {
  let data = formData

  if(not(data.exploitation_periods)) data.exploitation_periods = []

  if(not(data.fares)) data.fares = "Gratuit"

  if(not(data.images)) data.images = []

  return {...formData, ...data}
}

// export const normalizeTrailFormData = formData => {
//   let data = formData
//
//   if(data.activities) {
//     data.activities = data.activities.map((item, index) => {
//       if (not(item === null)) return index
//     })
//   }
//
//
// }


export const normalizeTSFormData = formData => {
  let data = formData

  if(not(data.valid)) data.valid = true
  if(not(data.visible)) data.visible = true


  return {...formData, ...data}

}
