import { getRandomArbitrary as rand } from "../Utils/numbers.js"

export const generateRandomGeom = () => {
    let type = "LineString"
    let coordinates = [...Array(15).keys()].map(_ => [rand(-180, 180), rand(-90, 90)])

    return {
        type, 
        coordinates
    }
}

export const generateRandomGeomWithZ = () => {
    let type = "LineString"
    let coordinates = [...Array(15).keys()].map(_ => [rand(-180, 180), rand(-90, 90), rand(-400, 8848)])

    return {
        type, 
        coordinates
    }
}

export const findDepthOfObject = (obj) => {
    var depth = 0;
    if (obj.children) {
        obj.children.forEach(function (d) {
            var tmpDepth = getDepth(d)
            if (tmpDepth > depth) {
                depth = tmpDepth
            }
        })
    }
    return 1 + depth
}