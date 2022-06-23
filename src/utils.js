import * as THREE from 'three'

class Utils {
    constructor () {}

    static createBoxWithRoundedEdges(width, height, depth, radius0, smoothness) {
        let shape = new THREE.Shape()
        let eps = 0.00001
        let radius = radius0 - eps
        shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true)
        shape.absarc(eps, height -  radius * 2, eps, Math.PI, Math.PI / 2, true)
        shape.absarc(width - radius * 2, height -  radius * 2, eps, Math.PI / 2, 0, true)
        shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true)
        let geometry = new THREE.ExtrudeBufferGeometry(shape, {
          depth: depth - radius0 * 2,
          bevelEnabled: true,
          bevelSegments: smoothness * 2,
          steps: 1,
          bevelSize: radius,
          bevelThickness: radius0,
          curveSegments: smoothness
        })
        
        geometry.center()
        
        return geometry
    }

    static createBoxWithRoundedSide(rad, depth) {
        let shape = new THREE.Shape()
        let angleStep = Math.PI * 0.5
        let radius = rad

        shape.absarc(2, 2, radius, angleStep * 0, angleStep * 1)
        shape.absarc(-2, 2, radius, angleStep * 1, angleStep * 2)
        shape.absarc(-2, -2, radius, angleStep * 2, angleStep * 3)
        shape.absarc(2, -2, radius, angleStep * 3, angleStep * 4)
        let geometry = new THREE.ExtrudeGeometry(shape, {
            depth: depth,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelSegments: 20,
            curveSegments: 20
        })
        geometry.center()
        geometry.rotateX(Math.PI * -0.5)
                
        return geometry
    }
}

export { Utils }