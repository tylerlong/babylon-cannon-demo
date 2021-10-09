import * as THREE from 'three';
import * as CANNON from 'cannon-es';

let world: CANNON.World;
let body: CANNON.Body;
let shape;
const timeStep = 1 / 60;
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let geometry;
let material;
let mesh: THREE.Mesh;

initThree();
initCannon();
animate();

function initCannon() {
  world = new CANNON.World();
  world.gravity.set(0, 0, 0);
  world.broadphase = new CANNON.NaiveBroadphase();

  shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
  body = new CANNON.Body({
    mass: 1,
  });
  body.addShape(shape);
  body.angularVelocity.set(0, 10, 0);
  body.angularDamping = 0.5;
  world.addBody(body);
}

function initThree() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    100
  );
  camera.position.z = 5;
  scene.add(camera);

  geometry = new THREE.BoxGeometry(2, 2, 2);
  material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  updatePhysics();
  render();
}

function updatePhysics() {
  // Step the physics world
  world.step(timeStep);

  // Copy coordinates from Cannon.js to Three.js
  mesh.position.copy(body.position as unknown as THREE.Vector3);
  mesh.quaternion.copy(body.quaternion as unknown as THREE.Quaternion);
}

function render() {
  renderer.render(scene, camera);
}
