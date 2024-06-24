import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({
    antialias: true,
})

renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)



const geometry = new THREE.TorusGeometry(1,0.1,16,100);
const material = new THREE.MeshStandardMaterial({
    color: 0x0077ff,
    
})
const torus = new THREE.Mesh(geometry,material);
scene.add(torus);

const torus2  = new THREE.Mesh(geometry,material);

scene.add(torus2)


const sphere = new THREE.OctahedronGeometry(0.5,0);
const mat = new THREE.MeshStandardMaterial({
    color:0x0077ff,
    emissive:0x0077ff,
    emissiveIntensity:10,
    wireframe:true,
    wireframeLinewidth:10,
})

let emsphere = new THREE.Mesh(sphere,mat)
emsphere.position.set(0,0,0)
scene.add(emsphere)




const pointLight = new THREE.PointLight(0x0077ff, 30);
pointLight.position.set(0,0,0);
scene.add(pointLight);


const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera,);
composer.addPass(renderPass);


const bloomPass= new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,  // strength
    0.3,  // radius
    0.9  // threshold
)

composer.addPass(bloomPass);

let angle = 0;
let detail = 0;
let frame = 0;
function updateEmisphereDetail(level) {
    scene.remove(emsphere);
    emsphere.geometry.dispose();
    emsphere = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, level), mat);
    emsphere.position.set(0, 0, 0);
    scene.add(emsphere);
}


function animate(){
    frame += 1;
    requestAnimationFrame(animate);
    angle += 0.01;
    
    
    torus.rotation.x =angle// Math.cos(angle);
    //torus.rotation.y = Math.sin(angle);
    torus2.rotation.x = Math.sin(angle);
    torus2.rotation.y = Math.cos(angle);
    torus2.rotation.z += 0.1
    
    emsphere.rotation.x += 0.01;
    emsphere.rotation.y += 0.01;
    emsphere.rotation.z += 0.01;
    composer.render()
}

window.addEventListener('resize',()=>{
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
})

animate();