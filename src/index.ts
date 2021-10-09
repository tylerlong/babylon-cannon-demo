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
  PlaneGeometry,
  RepeatWrapping,
} from 'three';
import {
  World,
  Body,
  NaiveBroadphase,
  Plane,
  Sphere,
  Material,
  ContactMaterial,
} from 'cannon-es';

import ballImage from './ball.png';
import groundImage from './ground.png';

let world: World;
let body: Body;
let camera: PerspectiveCamera;
let scene: Scene;
let renderer: WebGLRenderer;
let ballMesh: Mesh;
let groundMesh: Mesh;

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
  const ballMaterial = new MeshPhongMaterial({map: ballTexture});
  ballMesh = new Mesh(geometry, ballMaterial);
  scene.add(ballMesh);

  const ground = new PlaneGeometry(100, 100);
  const groundTexture = textureLoader.load(groundImage);
  groundTexture.wrapS = groundTexture.wrapT = RepeatWrapping;
  groundTexture.repeat.set(20, 20);
  const groundMaterial = new MeshPhongMaterial({map: groundTexture});
  groundMesh = new Mesh(ground, groundMaterial);
  scene.add(groundMesh);

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
  const bodyMaterial = new Material();
  body = new Body({
    mass: 1,
    material: bodyMaterial,
  });
  body.addShape(shape);
  body.angularDamping = 0.9;
  body.position.set(0, 0, 3);
  world.addBody(body);

  // Create ground
  const groundMaterial = new Material();
  const groundBody = new Body({
    mass: 0,
    material: groundMaterial,
  });
  const groundShape = new Plane();
  groundBody.addShape(groundShape);
  world.addBody(groundBody);

  world.addContactMaterial(
    new ContactMaterial(groundMaterial, bodyMaterial, {
      friction: 0.5,
      restitution: 0.7,
    })
  );

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
  ballMesh.position.copy(body.position as unknown as Vector3);
  ballMesh.quaternion.copy(body.quaternion as unknown as Quaternion);
}

function render() {
  renderer.render(scene, camera);
}
