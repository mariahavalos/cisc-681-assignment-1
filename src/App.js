import React from 'react'
import React3 from 'react-three-renderer'
import * as THREE from 'three'
import ReactDOM from 'react-dom'

export default class Simple extends React.Component {
  constructor (props) {
    super(props)
    this.starburst = this.starburst.bind(this)
    this.sphere = this.sphere.bind(this)
    this.cube = this.cube.bind(this)
    this.regularPolygonGeometry = this.regularPolygonGeometry.bind(this)
    this.openBox = this.openBox.bind(this)
  }

  openBox () {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = [
      new THREE.MeshLambertMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      }),
      new THREE.MeshLambertMaterial({
        color: 0xff0000,
        transparent: false,
        side: THREE.DoubleSide
      }),
      new THREE.MeshLambertMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      }),
      new THREE.MeshLambertMaterial({
        color: 0xff0000,
        transparent: false,
        side: THREE.DoubleSide
      }),
      new THREE.MeshLambertMaterial({
        color: 0xff0000,
        transparent: false,
        side: THREE.DoubleSide
      })
    ]

    const box = new THREE.Mesh(geometry, material)
    box.rotation.x = 0.9
    box.rotation.y = 0.5

    return box
  }

  regularPolygonGeometry (sides, innerColor, outerColor) {
    let geometry = new THREE.Geometry()

    for (let x = 0; x < sides; x++) {
      geometry.vertices.push(
        new THREE.Vector3(
          2 * Math.sin(Math.PI / sides + x * ((2 * Math.PI) / sides)),
          2 * Math.cos(Math.PI / sides + x * ((2 * Math.PI) / sides)),
          1
        )
      )
      let face = new THREE.Face3(0, x + 1, x + 2)
      face.vertexColors.push(new THREE.Color(outerColor))
      face.vertexColors.push(new THREE.Color(innerColor))
      face.vertexColors.push(new THREE.Color(innerColor))

      geometry.faces.push(face)
    }

    const material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide
    })

    const polygon = new THREE.Mesh(geometry, material)
    return polygon
  }

  cube () {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: '#0000ff' })
    return new THREE.Mesh(geometry, material)
  }

  sphere (numberOfBursts, radius) {
    let geometry = new THREE.BoxBufferGeometry(1, 1, 1)
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    let group = new THREE.Group()

    for (let i = 0; i < numberOfBursts; i++) {
      const theta = THREE.Math.randFloatSpread(360)
      const phi = THREE.Math.randFloatSpread(360)

      const diameter = radius * 2
      const positionX = diameter * Math.sin(theta) * Math.cos(phi)
      const positionY = diameter * Math.sin(theta) * Math.sin(phi)

      let starburst2 = this.starburst(200, 'red', 'green')
      starburst2.position.set(positionX, positionY, 0)

      let starburst1 = this.starburst(200, 'red', 'green')
      starburst1.position.set(-positionX, -positionY, 0)

      group.add(starburst1)
      group.add(starburst2)
    }

    return group
  }

  starburst (n, innerColor, outerColor) {
    let geometry = new THREE.Geometry()

    for (let x = 0; x < n; x++) {
      const theta = THREE.Math.randFloatSpread(360)
      const phi = THREE.Math.randFloatSpread(360)
      const randomNumber = Math.floor(Math.random() * n)
      const randomDegrees = Math.floor(Math.random() * 721) - 360
      const randomLength = Math.floor(Math.random() * 3) - 1

      geometry.vertices.push(
        new THREE.Vector3(
          2 * Math.sin(theta) * Math.cos(phi),
          2 * Math.sin(theta) * Math.sin(phi),
          0.1
        )
      )
      geometry.vertices.push(new THREE.Vector3(0, 0, 0.1))
      geometry.vertices.push(
        new THREE.Vector3(
          2 * Math.sin(theta) * Math.cos(phi),
          2 * Math.sin(theta) * Math.sin(phi),
          0.1
        )
      )
      geometry.vertices.push(new THREE.Vector3(0, 0, 0.1))
      geometry.colors.push(new THREE.Color(outerColor))
      geometry.colors.push(new THREE.Color(innerColor))
      geometry.colors.push(new THREE.Color(outerColor))
      geometry.colors.push(new THREE.Color(innerColor))
    }

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      linewidth: 20
    })
    const starburst = new THREE.Line(geometry, material, THREE.LineStrip)
    return starburst
  }

  componentDidMount () {
    const width = window.innerWidth
    const height = window.innerHeight

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(800, width / height, 0.5, 1000)
    this.camera.position.z = 10

    this.renderer = new THREE.WebGLRenderer({ antialias: true })

    /***************************************************************/
    /** UNCOMMENT THE BELOW LINES FOR EACH ASSIGNMENT PROBLEM! */

    const geometry = this.starburst(200, 'red', 'green')
    // const geometry = this.sphere(10, 2)
    // const geometry = this.regularPolygonGeometry(8, 'red', 'blue')
    // const geometry = this.cube()
    // const geometry = this.openBox()

    /** ********************************************************* */

    this.renderer.setClearColor('white')
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)

    this.scene.add(geometry)

    const light = new THREE.PointLight(0xffffff, 1, 1000)
    light.position.set(0, 10, 20)
    const ambientLight = new THREE.AmbientLight(0x222222)
    this.scene.add(light)
    this.scene.add(ambientLight)

    this.start()
  }

  start = () => {
    this.frame = requestAnimationFrame(this.rotate)
  }

  rotate = () => {
    this.renderScene()
    this.frame = window.requestAnimationFrame(this.rotate)
  }
  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }
  render () {
    return (
      <div
        ref={mount => {
          this.mount = mount
        }}
      />
    )
  }
}
