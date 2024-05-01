import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { WheelAdaptor } from 'three-story-controls'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { PI } from 'three/examples/jsm/nodes/Nodes.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
	50,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
const renderer = new THREE.WebGLRenderer({ alpha: true })
camera.position.set(3, 0, -3)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false
controls.enablePan = false
controls.autoRotate = false
controls.minPolarAngle = Math.PI / 9
controls.maxPolarAngle = (Math.PI / 6) * 5
controls.target.set(1.5, 0.2, -1)

scene.background = new THREE.Color(0x76a163)

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
const direction = new THREE.Vector3(0, 0, -1)
raycaster.set(camera.position, direction.normalize())

const loader = new GLTFLoader()

let room
let notebook
let readingArea
const pointLight = addPointLight()
const ambLight = addAmbientLight()

window.onload = () => {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)
	room = loadRoom()
	notebook = loadNotebook()
	readingArea = loadReadingArea()
	scene.add(pointLight)
	scene.add(ambLight)
	animate()
	raycast()
	console.log(scene.children)
}

function animate() {
	requestAnimationFrame(animate)
	renderer.render(scene, camera)
}

function loadRoom() {
	loader.load(
		'/room.glb',
		function (gltf) {
			gltf.scene.scale.set(2, 2, 2)
			scene.add(gltf.scene)
			room = gltf.scene
			room.userData.groupName = 'room'
		},
		undefined,
		function (error) {
			console.error(error)
		}
	)
	return room
}

function loadNotebook() {
	loader.load(
		'/notebook.glb',
		function (gltf) {
			gltf.scene.scale.set(2, 2, 2)
			scene.add(gltf.scene)
			notebook = gltf.scene

			// notebook.traverse((object)=>{
			//     if (object.isMesh && object.material) {
			//         object.material.emissive = new THREE.Color(0xffffff)
			//         object.material.emissiveIntensity = 0.3
			//     }
			// })

			notebook.userData.groupName = 'notebook'
		},
		undefined,
		function (error) {
			console.error(error)
		}
	)
	return notebook
}

function loadReadingArea() {
	loader.load(
		'/readingArea.glb',
		function (gltf) {
			gltf.scene.scale.set(2, 2, 2)
			scene.add(gltf.scene)
			readingArea = gltf.scene
			readingArea.userData.groupName = 'readingArea'
		},
		undefined,
		function (error) {
			console.error(error)
		}
	)
	return readingArea
}

function addPointLight() {
	const light = new THREE.PointLight(0xdbc7a4, 10)
	light.position.set(0, 2, 0)
	return light
}

function addAmbientLight() {
	const light = new THREE.AmbientLight(0xfce9cf, 2)
	return light
}

function raycast() {
	// window.addEventListener('click', ()=> {
	// 	// pointer.x = (event.clientX / window.innerWidth) * 2 - 1
	// 	// pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
	// 	// raycaster.setFromCamera(pointer,camera)
	// 	// const intersects = raycaster.intersectObjects(scene.children, true)
	// 	// for(let i = 0; i < intersects.length; i ++ ) {
	// 		let object = intersects[i].object
	// 		while(object) {
	// 			if (object.userData.groupName === 'notebook') {
	//                 console.log(object)
	//                 // var Post = document.getElementById('makePost');
	//                 // console.log(Post.style.display)
	//                 // if (Post.style.display === 'none') {
	//                 //     Post.style.display = 'block';
	//                 // }
	// 				break
	// 			}
	// 			if(object.userData.groupName === 'readingArea') {
	//                 console.log('clicked on reading area')
	//                 var All = document.getElementById('all-posts');
	//                 console.log(All.style.display)
	//                 if (All.style.display === 'none') {
	//                     All.style.display = 'block';
	//                 }
	//                 break
	// 			}
	// 			object = object.parent
	// 		}
	// 	}
	// })

	window.addEventListener('mousemove', (event) => {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(pointer, camera)
		const intersects = raycaster.intersectObjects(scene.children, true)
		for (let i = 0; i < intersects.length; i++) {
			let object = intersects[i].object
			while (object) {
				if (object.userData.groupName === 'notebook') {
					notebook.traverse((object) => {
						if (object.isMesh && object.material) {
							object.material.emissive = new THREE.Color(0xffffff)
							object.material.emissiveIntensity = 0.3
						}
					})
					break
					// console.log('mouse hovered on notebook')
				}
				// else {
				//     notebook.traverse((object)=>{
				//         if (object.isMesh && object.material) {
				//             object.material.emissive = new THREE.Color(0x000000)
				//         }
				//     })
				// 	break
				//     // console.log('mouse leave notebook')
				// }
				// if(object.userData.groupName === 'readingArea') {
				//     console.log('mouse hovered on reading area')
				//     break
				// }
				object = object.parent
			}
		}
	})
}
