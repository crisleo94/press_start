import { useEffect } from 'react'
import {
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneBufferGeometry,
  RepeatWrapping,
  Scene,
  sRGBEncoding,
  TextureLoader,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import './App.css'

export default function App() {
  let obj

  useEffect(() => {
    const scene = new Scene()
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const renderer = new WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // set loader for the model
    const loader = new GLTFLoader()
    const light = new HemisphereLight(0xffffff, 0x000000, 1.5)
    scene.add(light)
    camera.position.set(0, 0.5, 4)

    // add woood texture and create the floor
    const wooddenTexture = new TextureLoader().load('src/assets/floor.jpg')
    wooddenTexture.wrapS = wooddenTexture.wrapT = RepeatWrapping
    wooddenTexture.repeat.set(10, 10)
    wooddenTexture.anisotropy = 16
    wooddenTexture.encoding = sRGBEncoding
    const wooddenMaterial = new MeshStandardMaterial({ map: wooddenTexture })
    const mesh = new Mesh(new PlaneBufferGeometry(10, 10), wooddenMaterial)
    mesh.position.y = 0.0
    mesh.rotation.x = -Math.PI / 2
    mesh.receiveShadow = true
    scene.add(mesh)

    loader.load(
      'src/assets/chair.glb',
      (gltf) => {
        obj = gltf.scene
        scene.add(obj)
      },
      undefined,
      (error) => {
        console.error(error)
      }
    )

    // add controls
    const controls = new OrbitControls(camera, renderer.domElement)
    camera.position.set(0, 0.5, 4)
    controls.update()

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()
  })

  return <div />
}
