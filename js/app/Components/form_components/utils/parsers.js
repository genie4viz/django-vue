import curry, { partial, pipe, trace } from '../../../Utils/functional.js'

export const extractGeom = shape => shape.geometry
export const addZ = coordinates => coordinates.map((coordinate => {
    if (coordinate.length == 2) {
        return [...coordinate, 0]
    } else {
        return coordinate
    }
}))
export const buildShape = partial((fn, shape) => ({ type: shape.type, coordinates: fn(shape.coordinates) }))


const shapeParser = pipe(
    extractGeom,
    buildShape(addZ),
)

export default shapeParser
