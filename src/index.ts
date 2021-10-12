import * as BABYLON from 'babylonjs';
import * as CANNON from 'cannon-es';
import {Howl} from 'howler';

import Maze from './maze';
import './index.css';

import rollingWav from './sounds/rolling.wav';
import clinkWav from './sounds/clink.wav';
import dingWav from './sounds/ding.wav';

import {createWalls} from './meshes/walls';
import {createGround} from './meshes/ground';
import {createPickup} from './meshes/pickup';
import {createBall} from './meshes/ball';

(global as unknown as {CANNON: typeof CANNON}).CANNON = CANNON;

const rollingSound = new Howl({
  src: rollingWav,
  volume: 0,
  loop: true,
  rate: 4.0,
});
rollingSound.play();

const clinkSound = new Howl({
  src: clinkWav,
  volume: 1 / 16,
});

const dingSound = new Howl({
  src: dingWav,
  volume: 1,
});

const maze = new Maze(5);

// Create canvas
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

// Load the 3D engine
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

const scene = new BABYLON.Scene(engine);

// Add physics engine
const gravityVector = new BABYLON.Vector3(0, -9.8, 0);
const physicsPlugin = new BABYLON.CannonJSPlugin();
scene.enablePhysics(gravityVector, physicsPlugin);

// Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
const camera = new BABYLON.FreeCamera(
  'camera',
  new BABYLON.Vector3(0, 5, -10),
  scene
);

const light = new BABYLON.SpotLight(
  'light',
  new BABYLON.Vector3(0, 4, 0), // x, z will be override anyway
  new BABYLON.Vector3(0, -1, 0.5),
  Math.PI / 3,
  30,
  scene
);

const ground = createGround(maze, scene);
const walls = createWalls(maze, scene)!;
const pickup = createPickup(maze, scene);
const ball = createBall(maze, scene);

ball.physicsImpostor!.registerOnPhysicsCollide(walls.physicsImpostor!, () => {
  clinkSound.play();
});
ball.physicsImpostor!.registerOnPhysicsCollide(pickup.physicsImpostor!, () => {
  dingSound.play();
});

const speed = 3;
window.addEventListener('keydown', event => {
  switch (event.key) {
    case 'ArrowLeft': {
      event.preventDefault();
      ball.physicsImpostor?.setLinearVelocity(
        new BABYLON.Vector3(-speed, 0, 0)
      );
      break;
    }
    case 'ArrowRight': {
      event.preventDefault();
      ball.physicsImpostor?.setLinearVelocity(new BABYLON.Vector3(speed, 0, 0));
      break;
    }
    case 'ArrowUp': {
      event.preventDefault();
      ball.physicsImpostor?.setLinearVelocity(new BABYLON.Vector3(0, 0, speed));
      break;
    }
    case 'ArrowDown': {
      event.preventDefault();
      ball.physicsImpostor?.setLinearVelocity(
        new BABYLON.Vector3(0, 0, -speed)
      );
      break;
    }
    default: {
      break;
    }
  }
});

// run the render loop
engine.runRenderLoop(() => {
  camera.position.x = ball.position.x;
  camera.position.z = ball.position.z - 2;
  light.position.x = ball.position.x;
  light.position.z = ball.position.z - 2;
  camera.setTarget(ball.position);
  const v = ball.physicsImpostor!.getLinearVelocity()!;
  rollingSound.volume(Math.max(Math.abs(v.x), Math.abs(v.z)) / speed / 2);
  scene.render();
});

// the canvas/window resize event handler
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  engine.resize();
});
