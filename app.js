import * as THREE from 'three'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/loaders/MTLLoader.js'
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/loaders/FBXLoader.js'
import { Utils } from './src/utils.js'

class BoxScene {
    constructor() {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(110, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer()
        this.object = new THREE.Mesh()
        this.controls = null
        this.rotate = false
        this.material = null
        this.geometry = null
       
        this.initVariable()
        this.initComponent()
        this.initEventListener()
    }

    start() {
        this.setCameraPosition({ z: 2 })
        this.setRenderer()
        if (this.updateLighting) {
            this.setLighting(0xffffff, 2)
        }
            
        this.setOrbitControls()
        this.setBackgroundScene()
        this.createObject()

        // this.createDoor()
        // this.load3D()
        // this.load3DObject(null, 'FBX')

        this.windowResizeHandler()
        this.animate()
    }

    initVariable() {
        this.texture = "./assets/textures/container-1.jpg"
        this.bgScene = "./assets/scenes/white-3.png"
        this.updateLighting = true
        this.rotateSpeedValue = 0.005
        this.objectColor = 0x404040
        this.objectWidth = 3
        this.objectHeight = 1
        this.objectDepth = 1
    }

    initComponent() {
        this.rotateCheck = document.querySelector('#isRotating')
        this.rotateSpeed = document.querySelector('#rotateSpeed')
        this.inputColor = document.querySelector('[data-color]')
        this.textures = document.querySelectorAll('.choose-textures')
        this.scenes = document.querySelectorAll('.choose-scenes')
        this.customTexture = document.querySelector('#customTexture')
        this.customBackground = document.querySelector('#customBackground')
        this.objectWidthInput = document.querySelector('#objectWidth')
        this.objectHeightInput = document.querySelector('#objectHeight')
        this.objectDepthInput = document.querySelector('#objectDepth')
    }

    initEventListener() {
        this.changeColorEvent()
        this.changeTexturesEvent()
        this.changeSceneEvent()
        this.rotateEvent()
        this.rotateSpeedEvent()
        this.customTextureEvent()
        this.customBackgroundEvent()
        this.objectDimensionEvent()
    }

    setBackgroundScene() {
        const loader = new THREE.TextureLoader()
        const bgTexture = loader.load(this.bgScene)
        this.scene.background = bgTexture
    }

    objectDimensionEvent() {
        [this.objectHeightInput, this.objectWidthInput, this.objectDepthInput].forEach(dimension => {
            dimension.onkeyup = () => {
                this.updateObjectDimension(
                    this.objectWidthInput.value,
                    this.objectHeightInput.value,
                    this.objectDepthInput.value,
                )
            }
        })
    }

    customTextureEvent() {
        this.customTexture.onchange = (e) => {
            const file = e.target.files[0]
            this.texture = URL.createObjectURL(file)
            this.updateTexture()
        }
    }

    customBackgroundEvent() {
        this.customBackground.onchange = (e) => {
            const file = e.target.files[0]
            this.bgScene = URL.createObjectURL(file)
            this.setBackgroundScene()
        }
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

    rotateSpeedEvent() {
        this.rotateSpeed.oninput = (e) => {
            if (!this.rotateCheck.checked) return
            this.rotateSpeedValue = Number(e.target.value)
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

    createDoor() {
        const material = new THREE.MeshNormalMaterial()
        material.side = THREE.DoubleSide

        const door = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.2), material)
        door.position.set(1, 0, 0.43)
        this.scene.add(door)
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

    load3D() {
        const mtlLoader = new MTLLoader()
        const path = "assets/models/container-2/konteynrer.mtl"
        // const path = "assets/models/container/12281_Container_v2_L2.mtl"
        mtlLoader.load(path, (materials) => {
            materials.preload()
            this.load3DObject(materials)
        })
    }

    load3DObject(materials = null, mode = 'OBJ') {
        let loader
        if (mode = 'OBJ') {
            loader = new OBJLoader()
        } else {
            loader = new FBXLoader()
        }

        if (materials) {
            loader.setMaterials(materials)
        }

        loader.load(
            // 'assets/models/container-2/konteynrer.fbx',
            'assets/models/container/12281_Container_v2_L2.obj',
            (object) => {
                this.scene.add(object)
            },
            (xhr) => {
                console.log(( xhr.loaded / xhr.total * 100 ) + '% loaded')
            },
            (error) => {
                console.log('An error happened')
            }
        )
    }

    createObject() {
        let geoOptions = [3, this.objectDepth]
        // let geoOptions = [this.objectWidth, this.objectHeight, this.objectDepth, 5/9, 16]

        // this.geometry = new THREE.BoxGeometry(...geoOptions)
        this.geometry = Utils.createBoxWithRoundedSide(...geoOptions)
        this.material = new THREE.MeshPhongMaterial()

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

    updateObjectDimension(width, height, depth) {
        this.object.scale.set(
            width / this.objectWidth,
            height / this.objectHeight, 
            depth / this.objectDepth, 
        )
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
                y: this.rotateSpeedValue
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