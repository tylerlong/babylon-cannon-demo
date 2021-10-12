import * as BABYLON from 'babylonjs';

import Maze from './maze';
import {clinkSound, dingSound, rollingSound} from './sounds';
import {createWalls} from './meshes/walls';
import {createGround} from './meshes/ground';
import {createPickup} from './meshes/pickup';
import {createBall} from './meshes/ball';
import {uuid} from './utils';

class Scene {
  maze: Maze;
  scene: BABYLON.Scene;
  camera: BABYLON.FreeCamera;
  light: BABYLON.SpotLight;
  ball: BABYLON.Mesh;

  constructor(engine: BABYLON.Engine, mazeSize: number, callback: () => void) {
    this.maze = new Maze(mazeSize);
    this.scene = new BABYLON.Scene(engine);

    const gravityVector = new BABYLON.Vector3(0, -9.8, 0);
    const physicsPlugin = new BABYLON.CannonJSPlugin();
    this.scene.enablePhysics(gravityVector, physicsPlugin);

    this.camera = new BABYLON.FreeCamera(
      uuid(),
      new BABYLON.Vector3(0, 5, -10),
      this.scene
    );

    this.light = new BABYLON.SpotLight(
      uuid(),
      new BABYLON.Vector3(0, 4, 0), // x, z will be override anyway
      new BABYLON.Vector3(0, -1, 0.5),
      Math.PI / 3,
      30,
      this.scene
    );

    createGround(this.maze, this.scene);
    const walls = createWalls(this.maze, this.scene)!;
    const pickup = createPickup(this.maze, this.scene);
    this.ball = createBall(this.maze, this.scene);

    this.ball.physicsImpostor!.registerOnPhysicsCollide(
      walls.physicsImpostor!,
      () => {
        clinkSound.play();
      }
    );

    this.ball.physicsImpostor!.registerOnPhysicsCollide(
      pickup.physicsImpostor!,
      () => {
        dingSound.play();
        callback();
      }
    );

    rollingSound.play();
  }

  render() {
    this.camera.position.x = this.ball.position.x;
    this.camera.position.z = this.ball.position.z - 2;
    this.camera.setTarget(this.ball.position);
    this.light.position.x = this.ball.position.x;
    this.light.position.z = this.ball.position.z - 2;
    const v = this.ball.physicsImpostor!.getLinearVelocity()!;
    rollingSound.volume(Math.max(Math.abs(v.x), Math.abs(v.z)) / 6);
    this.scene.render();
  }

  dispose() {
    this.scene.dispose();
  }
}

export default Scene;
