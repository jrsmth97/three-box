import * as THREE from 'three'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/loaders/MTLLoader.js'
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/loaders/FBXLoader.js'
import { ColladaLoader } from 'https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/loaders/ColladaLoader.js'
import { TDSLoader } from 'https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/loaders/TDSLoader.js'
import { STLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/loaders/STLLoader.js'
import { PLYLoader } from 'https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/loaders/PLYLoader.js'

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
        this.texture = "assets/textures/container-1.jpg"
        this.bgScene = "assets/scenes/white-3.png"
        this.updateLighting = true
        this.rotateSpeedValue = 0.005
        this.object3d = null
        // this.materialPath = 'assets/models/scifi-1/Intergalactic_Spaceship-(Wavefront).mtl'
        // this.objPath = 'assets/models/scifi-1/Intergalactic_Spaceship-(Wavefront).obj'
        // this.materialPath = 'assets/models/dragon-1/dae/Dragon_2.5.dae.mtl'
        this.objPath = 'assets/models/dragon-1/ply/Dragon_2_5.ply'
        this.scale3dSet = 0.2;
        this.mixer = null
        this.skin = null
        this.clock = new THREE.Clock()
       
        this.initComponent()
        this.changeColorEvent()
        this.changeTexturesEvent()
        this.changeSceneEvent()
        this.rotateEvent()
        this.rotateSpeedEvent()
        this.customTextureEvent()
        this.customBackgroundEvent()
    }

    start() {
        this.setCameraPosition({ z: 2 })
        this.setRenderer()
        if (this.updateLighting) {
            this.setLighting(0xffffff, 2)
        }
            
        this.setOrbitControls()
        this.setBackgroundScene()
        // this.createObject(
        // {
        //     width: 3,
        //     height: 1,
        //     depth: 1,
        // })

        // this.createDoor()
        this.load3D()
        // this.load3DObject(null)

        this.windowResizeHandler()
        this.animate()
    }

    initComponent() {
        this.rotateCheck = document.querySelector('#isRotating')
        this.rotateSpeed = document.querySelector('#rotateSpeed')
        this.inputColor = document.querySelector('[data-color]')
        this.textures = document.querySelectorAll('.choose-textures')
        this.scenes = document.querySelectorAll('.choose-scenes')
        this.customTexture = document.querySelector('#customTexture')
        this.customBackground = document.querySelector('#customBackground')
    }

    setBackgroundScene() {
        const loader = new THREE.TextureLoader()
        const bgTexture = loader.load(this.bgScene)
        this.scene.background = bgTexture
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
        // const path = "assets/models/city-1/Center_City_Sci-Fi.mtl"
        if (this.materialPath && this.materialPath != '') {
            const path = this.materialPath
            // const path = "assets/models/container/12281_Container_v2_L2.mtl"
            mtlLoader.load(path, (materials) => {
                materials.preload()
                this.load3DObject(materials)
            })
        } else {
            console.log('no material added')
            this.load3DObject(null)
        }
    }

    load3DObject(materials = null) {
        let loader

        let fileExt = this.objPath.split('.')[1].toLowerCase();
        switch (fileExt) {
            case 'obj':
                loader = new OBJLoader()
            break
            case 'fbx':
                loader = new FBXLoader()
            break
            case 'dae':
                loader = new ColladaLoader()
            break
            case '3ds':
                loader = new TDSLoader()
            break
            case 'stl':
                loader = new STLLoader()
            break
            case 'ply':
                loader = new PLYLoader()
            break
            default: 
                throw new Error('unsupported file type')
        }

        if (materials) {
            loader.setMaterials(materials)
        }

        loader.load(
            // 'assets/models/container-2/konteynrer.fbx',
            // 'assets/models/city-1/Center_City_Sci-Fi.obj',
            this.objPath,
            (object) => {
                switch (fileExt) {
                    case 'dae':
                        this.loadDae(object)
                    break
                    case 'stl':
                        this.loadStlOrPly(object)
                    break
                    case '3ds':
                        this.object = object
                        this.scene.add(this.object)
                    break
                    case 'ply':
                        console.log(object)
                        this.loadStlOrPly(object)
                    break
                    // obj and fbx
                    default:
                        if (!materials && this.texture && this.texture != '') {
                            console.log('custom texture')
                            let texture = new THREE.TextureLoader().load(this.texture)
                            this.object.traverse((child) => { 
                                if (child instanceof THREE.Mesh) {
                                    child.material.map = texture;
                                }
                            })
                        }

                        this.object = object
                        this.object.scale.set(this.scale3dSet, this.scale3dSet, this.scale3dSet)
                        this.scene.add(this.object)
                }  
            },
            (xhr) => {
                console.log(( xhr.loaded / xhr.total * 100 ) + '% loaded')
            },
            (error) => {
                console.error(error)
            }
        )
    }

    loadDae(object) {
        this.object = object.scene
        this.skin = object.skins
        let sceneAnimationClip = object.scene.animations[0]
        // Create animation mixer and pass object to it
        this.mixer = new THREE.AnimationMixer(this.object)
    
        // Create animation action and start it
        this.mixer.clipAction(sceneAnimationClip).play()

        this.object.scale.x = this.object.scale.y = this.object.scale.z = .2
        this.object.updateMatrix()
        this.scene.add(this.object)
        this.animate()
    }

    loadStlOrPly(geometry) {
        this.geometry = geometry
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

    createObject(geometryOptions = null, materialOptions = {}) {
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
        let delta = this.clock.getDelta()
        if(this.mixer) {
            // console.log(delta)
            this.mixer.update(delta)
        }
    
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
        window.addEventListener('resize', this.onWindowResize(), false)
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