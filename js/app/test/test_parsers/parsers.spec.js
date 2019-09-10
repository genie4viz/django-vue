import expect from "expect"

import shapeParser, { addZ, buildShape } from "../../Components/form_components/utils/parsers.js"
import { 
    generateRandomGeom,
    generateRandomGeomWithZ,
    findDepthOfObject 
} from "../test_utils.js"

describe("Test shape parser", function () {
    const geom = generateRandomGeom()

    it("Should add a 0 to the geometry", function () {
        let geomZ = addZ(geom.coordinates)

        for (let coord of geomZ) {
            expect(coord.length).toEqual(3)
            expect(coord[2]).toEqual(0)
        }
    })

    it("Should not add 0 to a geom with a z dimension", function () {
        let geom = generateRandomGeomWithZ()

        let geomWithZpassthrough = addZ(geom.coordinates)

        for (let coord of geomWithZpassthrough) {
            expect(coord.length).toEqual(3)
            expect(coord[2]).toNotEqual(0)
        }
    })

    it ('Should build the correct shape object', function () {
        let shape = buildShape(addZ)(geom)

        expect(shape).toBeAn('object').toContain({type: "LineString"})
    })

    it ('Should combine a function and parse the right output', function () {
        const feature = {
            "type": "Feature",
            "properties": {},
            "geometry": geom
        }

        let parsedShape = shapeParser(feature)
        let dept = findDepthOfObject(parsedShape)
        expect(parsedShape).toNotEqual(2)
        expect(parsedShape).toNotContain({properties: {}})
    })
})