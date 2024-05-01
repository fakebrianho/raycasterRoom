import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { WheelAdaptor } from 'three-story-controls'
import gsap from 'gsap';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
const renderer = new THREE.WebGLRenderer({alpha: true});
camera.position.set(0, 2, 20)

scene.background = new THREE.Color(0x76a163)

const raycaster = new THREE.Raycaster();
const direction = new THREE.Vector3(0, 0, -1);
raycaster.set(camera.position, direction.normalize());

const loader = new GLTFLoader();

let model;
const light = addLight();

window.onload =()=>{
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	model = addModel();
	// scene.add(model)
	scene.add(light)
	animate()
	move()
}

function animate(){
	requestAnimationFrame(animate)
	renderer.render( scene, camera );
	checkCollision()
}

function addModel(){
	loader.load('/treeHole.glb', function ( gltf ) {
		gltf.scene.scale.set(0.5, 0.5, 0.5)
		gltf.scene.rotation.y = Math.PI/(-2)
		scene.add(gltf.scene)
		model = gltf.scene
	}, undefined, function ( error ) {
		console.error( error );
	} );
	return model
}

function addLight(){
	const light = new THREE.DirectionalLight(0xeabe95, 3)
	light.position.set(10, 15, 5)
	return light
}

function checkCollision() {
	if (!model) {
        return; 
    } else{
    raycaster.set(camera.position, direction.normalize());
    const intersects = raycaster.intersectObjects([model], true);
    if (intersects[0].distance < 1) {
        toBlack();
        console.log('Collide with cube');
    }
}
}

function toBlack() {
	gsap.to('#dissolve-to-white', {
	  opacity: 1,
	  duration: 2,
	  ease: 'power2.out',
	  onComplete: () => {
		window.location.href = '/start'
	  }
	});
}

function move(){
	const wheelAdaptor = new WheelAdaptor({ type: 'discrete' })
	wheelAdaptor.connect()
	wheelAdaptor.addEventListener('trigger', () => {
		let currentPosition = camera.position.z
		if(event.deltaY > 0){
			gsap.to(camera.position, {
				z: currentPosition - 5,
				duration: 0.5,
				ease: 'linear',
			})
		} else {
			gsap.to(camera.position, {
				z: currentPosition +5,
				duration: 0.5,
				ease: 'linear',
			})
		}
	})
}