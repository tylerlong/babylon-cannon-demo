import {Vector3, Quaternion} from 'three';
import {
  World,
  Body,
  NaiveBroadphase,
  Plane,
  Sphere,
  Material,
  ContactMaterial,
} from 'cannon-es';

import ThreeManager from './three-manager';

let world: World;
let body: Body;

const threeManager = new ThreeManager();
initCannon();
animate();

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
  threeManager.ballMesh.position.copy(body.position as unknown as Vector3);
  threeManager.ballMesh.quaternion.copy(
    body.quaternion as unknown as Quaternion
  );
}

function render() {
  threeManager.render();
}
