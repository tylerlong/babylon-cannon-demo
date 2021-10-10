import {
  Body,
  ContactMaterial,
  Material,
  NaiveBroadphase,
  Plane,
  Sphere,
  World,
} from 'cannon-es';
import {Quaternion, Vector3} from 'three';

import ThreeManager from './three-manager';

class CannonManager {
  ballBody: Body;
  world: World;

  constructor() {
    this.world = new World();
    this.world.gravity.set(0, 0, -9.82);
    this.world.broadphase = new NaiveBroadphase();

    // Create the ball
    const shape = new Sphere(1);
    const bodyMaterial = new Material();
    this.ballBody = new Body({
      mass: 1,
      material: bodyMaterial,
    });
    this.ballBody.addShape(shape);
    this.ballBody.angularDamping = 0.9;
    this.ballBody.position.set(0, 0, 3);
    this.world.addBody(this.ballBody);

    // Create ground
    const groundMaterial = new Material();
    const groundBody = new Body({
      mass: 0,
      material: groundMaterial,
    });
    const groundShape = new Plane();
    groundBody.addShape(groundShape);
    this.world.addBody(groundBody);

    this.world.addContactMaterial(
      new ContactMaterial(groundMaterial, bodyMaterial, {
        friction: 0.5,
        restitution: 0.7,
      })
    );

    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener('keydown', event => {
      const speed = 3;
      switch (event.key) {
        case 'ArrowLeft': {
          this.ballBody.angularVelocity.y = -speed;
          break;
        }
        case 'ArrowRight': {
          this.ballBody.angularVelocity.y = speed;
          break;
        }
        case 'ArrowUp': {
          this.ballBody.angularVelocity.x = -speed;
          break;
        }
        case 'ArrowDown': {
          this.ballBody.angularVelocity.x = speed;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  updatePhysics(threeManager: ThreeManager) {
    this.world.step(1 / 60);
    threeManager.ballMesh.position.copy(
      this.ballBody.position as unknown as Vector3
    );
    threeManager.ballMesh.quaternion.copy(
      this.ballBody.quaternion as unknown as Quaternion
    );
  }
}

export default CannonManager;
