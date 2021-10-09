import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  Vector3,
  Quaternion,
} from 'three';
import {World, Body, NaiveBroadphase, Vec3, Box} from 'cannon-es';

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
  camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    100
  );
  camera.position.z = 5;
  scene.add(camera);
  const geometry = new BoxGeometry(2, 2, 2);
  const material = new MeshBasicMaterial({color: 0xff0000, wireframe: true});
  mesh = new Mesh(geometry, material);
  scene.add(mesh);
  renderer = new WebGLRenderer();
  renderer.setSize(800, 600);
  document.body.appendChild(renderer.domElement);
}

function initCannon() {
  world = new World();
  world.gravity.set(0, 0, 0);
  world.broadphase = new NaiveBroadphase();
  const shape = new Box(new Vec3(1, 1, 1));
  body = new Body({
    mass: 1,
  });
  body.addShape(shape);
  body.angularVelocity.set(0, 10, 0);
  body.angularDamping = 0.5;
  world.addBody(body);
  document.addEventListener('keydown', event => {
    switch (event.key) {
      case 'ArrowLeft': {
        body.angularVelocity.y -= 10;
        break;
      }
      case 'ArrowRight': {
        body.angularVelocity.y += 10;
        break;
      }
      case 'ArrowUp': {
        body.angularVelocity.x -= 10;
        break;
      }
      case 'ArrowDown': {
        body.angularVelocity.x += 10;
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
