import * as THREE from 'three'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/controls/OrbitControls.js'

class BoxScene {
    constructor() {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(110, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer()
        this.object = new THREE.Mesh()
        this.objectColor = 0x404040
        this.controls = null
        this.rotate = false
        this.material = null
        this.geometry = null
        this.texture = "./assets/textures/container-1.jpg"
        this.bgScene = "./assets/scenes/white-3.png"
        this.updateLighting = true
       
        this.initComponent()
        this.changeColorEvent()
        this.changeTexturesEvent()
        this.changeSceneEvent()
        this.rotateEvent()
    }

    start() {
        this.setCameraPosition({ z: 2 })
        this.setRenderer()
        if (this.updateLighting) {
            this.setLighting(0xffffff, 2)
        }
            
        this.setOrbitControls()
        this.setBackgroundScene()
        this.createObject(
        {
            width: 3,
            height: 1,
            depth: 1,
        })

        this.windowResizeHandler()
        this.animate()
    }

    initComponent() {
        this.rotateCheck = document.querySelector('#isRotating')
        this.inputColor = document.querySelector('[data-color]')
        this.textures = document.querySelectorAll('.choose-textures')
        this.scenes = document.querySelectorAll('.choose-scenes')
    }

    setBackgroundScene() {
        const loader = new THREE.TextureLoader()
        const bgTexture = loader.load(this.bgScene)
        this.scene.background = bgTexture
    }

    rotateEvent() {
        this.rotateCheck.onchange = (e) => {
            if (e.target.checked) this.rotate = true
            else this.rotate = false

            this.renderer.renderLists.dispose()
            this.updateLighting = false
            this.animate()
        }
    }

    changeSceneEvent() {
        this.scenes.forEach(scn => {
            scn.onclick = (e) => {
                this.bgScene = e.target.getAttribute('src')
                this.updateLighting = false
                this.setBackgroundScene()
            }
        })
    }

    changeTexturesEvent() {
        this.textures.forEach(txt => {
            txt.onclick = (e) => {
                this.texture = e.target.getAttribute('src')
                this.updateLighting = false
                this.updateTexture()
            }
        })
    }

    changeColorEvent() {
        if (!this.inputColor) return
        this.inputColor.onchange = (e) => {
            const colorCode = e.target.value
            this.objectColor = new THREE.Color(colorCode)
            this.updateLighting = false
            this.updateColor()
        }
    }
    
    setRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)
    }

    setCameraPosition(position) {
        position.x ? this.camera.position.x = position.x : null
        position.y ? this.camera.position.y = position.y : null
        position.z ? this.camera.position.z = position.z : null
    }

    setLighting(lightColor, size) {
        const light = new THREE.AmbientLight(lightColor, size)
        light.position.set(15, 10, 0)
        light.castShadow = true
        this.scene.add(light)

        // const sphereSize = 1
        // const pointLightHelper = new THREE.PointLightHelper(light, sphereSize)
        // this.scene.add(pointLightHelper)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    }

    createObject(geometryOptions, materialOptions) {
        const geoOptions = Object.values(geometryOptions)
        this.geometry = new THREE.BoxGeometry(...geoOptions)
        this.material = new THREE.MeshPhongMaterial(materialOptions)

        const texture = new THREE.TextureLoader().load(this.texture)
        this.material.map = texture

        if (this.objectColor) {
            this.material.color.set(this.objectColor)
        }

        this.object.receiveShadow = true
        this.object = new THREE.Mesh(this.geometry, this.material)

        this.object.position.set(0, 0, 0)
        this.scene.add(this.object)
    }

    updateTexture() {
        const texture = new THREE.TextureLoader().load(this.texture)
        this.material.map = texture
    }

    updateColor() {
        this.material.color.set(this.objectColor)
    }

    setRotation(rotation) {
        rotation.x ? this.object.rotation.x += rotation.x : null
        rotation.y ? this.object.rotation.y += rotation.y : null
        rotation.z ? this.object.rotation.z += rotation.z : null
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this))
    
        if (this.rotate) {
            this.setRotation({ 
                // x: 0.01, 
                y: 0.005 
            })
        }

        this.controls.update()
        this.render()
    }
    
    render() {
        this.renderer.render(this.scene, this.camera)
    }

    windowResizeHandler() {
        window.addEventListener('resize', this.onWindowResize, false)
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.render()
    }
    
}   

const box = new BoxScene()
box.start()