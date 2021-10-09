import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Mesh,
  Vector3,
  Quaternion,
  SphereGeometry,
  MeshPhongMaterial,
  TextureLoader,
  PointLight,
} from 'three';
import {World, Body, NaiveBroadphase, Plane, Sphere} from 'cannon-es';

import ballImage from './ball.png';

let world: World;
let body: Body;
let camera: PerspectiveCamera;
let scene: Scene;
let renderer: WebGLRenderer;
let mesh: Mesh;

initThree();
initCannon();
animate();

function initThree() {
  scene = new Scene();

  const light = new PointLight(0xffffff, 1);
  light.position.set(1, 1, 5);
  scene.add(light);

  camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    100
  );
  camera.position.z = 5;
  scene.add(camera);
  const geometry = new SphereGeometry(1);
  const textureLoader = new TextureLoader();
  const ballTexture = textureLoader.load(ballImage);
  const material = new MeshPhongMaterial({map: ballTexture});
  mesh = new Mesh(geometry, material);
  scene.add(mesh);
  renderer = new WebGLRenderer();
  renderer.setSize(800, 600);
  document.body.appendChild(renderer.domElement);
}

function initCannon() {
  world = new World();
  world.gravity.set(0, 0, -9.82);
  world.broadphase = new NaiveBroadphase();

  // create the shape
  const shape = new Sphere(1);
  body = new Body({
    mass: 1,
  });
  body.addShape(shape);
  body.angularDamping = 0.9;
  body.position.set(0, 0, 2);
  world.addBody(body);

  // Create ground
  const groundBody = new Body({
    mass: 0,
  });
  const groundShape = new Plane();
  groundBody.addShape(groundShape);
  world.addBody(groundBody);

  document.addEventListener('keydown', event => {
    const speed = 3;
    switch (event.key) {
      case 'ArrowLeft': {
        body.angularVelocity.y = -speed;
        break;
      }
      case 'ArrowRight': {
        body.angularVelocity.y = speed;
        break;
      }
      case 'ArrowUp': {
        body.angularVelocity.x = -speed;
        break;
      }
      case 'ArrowDown': {
        body.angularVelocity.x = speed;
        break;
      }
      default: {
        break;
      }
    }
  });
}

function animate() {
  requestAnimationFrame(animate);
  updatePhysics();
  render();
}

function updatePhysics() {
  world.step(1 / 60);
  mesh.position.copy(body.position as unknown as Vector3);
  mesh.quaternion.copy(body.quaternion as unknown as Quaternion);
}

function render() {
  renderer.render(scene, camera);
}
