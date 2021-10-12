import * as BABYLON from 'babylonjs';
import * as CANNON from 'cannon-es';

import './index.css';

import {rollingSound} from './sounds';
import Scene from './scene';

(global as unknown as {CANNON: typeof CANNON}).CANNON = CANNON;

rollingSound.play();

// Create canvas
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

// Load the 3D engine
let engine: BABYLON.Engine | undefined;

// the canvas/window resize event handler
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  engine?.resize();
});

let scene: Scene;
const renderLoop = () => {
  scene.camera.position.x = scene.ball.position.x;
  scene.camera.position.z = scene.ball.position.z - 2;
  scene.camera.setTarget(scene.ball.position);
  scene.light.position.x = scene.ball.position.x;
  scene.light.position.z = scene.ball.position.z - 2;
  const v = scene.ball.physicsImpostor!.getLinearVelocity()!;
  rollingSound.volume(Math.max(Math.abs(v.x), Math.abs(v.z)) / 6);
  scene.scene.render();
};

let mazeSize = 5;
const newLevel = () => {
  if (engine) {
    engine.stopRenderLoop();
    engine.dispose();
  }
  engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  });
  scene = new Scene(engine, mazeSize, newLevel);
  mazeSize += 2;
  engine.runRenderLoop(renderLoop);
};
newLevel();
