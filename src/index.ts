import * as BABYLON from 'babylonjs';
import * as CANNON from 'cannon-es';
import {Howl} from 'howler';

import './index.css';

import ballImage from './tile.jpeg';
import concreteImage from './concrete.png';
import stoneImage from './stone.png';
import rollingSound from './rolling.wav';

import {createWalls} from './utils';
import Maze from './maze';

(global as unknown as {CANNON: typeof CANNON}).CANNON = CANNON;

const rolling = new Howl({
  src: rollingSound,
  volume: 0,
  loop: true,
  rate: 4.0,
});
rolling.play();

const maze = new Maze(21);

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

// Create a built-in "sphere" shape using the SphereBuilder
const sphere = BABYLON.MeshBuilder.CreateSphere(
  'sphere',
  {segments: 16, diameter: 0.4, sideOrientation: BABYLON.Mesh.FRONTSIDE},
  scene
);
sphere.position = new BABYLON.Vector3(
  maze.player.x - (maze.size - 1) / 2,
  0.2,
  maze.player.z - (maze.size - 1) / 2
);
const sphereMaterial = new BABYLON.StandardMaterial('sphere', scene);
sphereMaterial.diffuseTexture = new BABYLON.Texture(ballImage, scene);
sphere.material = sphereMaterial;

// Create a built-in "ground" shape;
const ground = BABYLON.MeshBuilder.CreateGround(
  'ground',
  {width: maze.size, height: maze.size, updatable: false},
  scene
);
const groundMaterial = new BABYLON.StandardMaterial('ground', scene);
groundMaterial.diffuseTexture = new BABYLON.Texture(concreteImage, scene);
(groundMaterial.diffuseTexture as BABYLON.Texture).uScale = (maze.size - 1) / 2;
(groundMaterial.diffuseTexture as BABYLON.Texture).vScale = (maze.size - 1) / 2;
ground.material = groundMaterial;

// Create walls
const walls = createWalls(maze, scene)!;
const wallMaterial = new BABYLON.StandardMaterial('wall', scene);
wallMaterial.diffuseTexture = new BABYLON.Texture(stoneImage, scene);
walls.material = wallMaterial;

sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
  sphere,
  BABYLON.PhysicsImpostor.SphereImpostor,
  {mass: 1, restitution: 0.9},
  scene
);
ground.physicsImpostor = new BABYLON.PhysicsImpostor(
  ground,
  BABYLON.PhysicsImpostor.BoxImpostor,
  {mass: 0, restitution: 0.9},
  scene
);
walls.physicsImpostor = new BABYLON.PhysicsImpostor(
  walls,
  BABYLON.PhysicsImpostor.MeshImpostor,
  {mass: 0, restitution: 0},
  scene
);

const speed = 3;
window.addEventListener('keydown', event => {
  switch (event.key) {
    case 'ArrowLeft': {
      event.preventDefault();
      sphere.physicsImpostor?.setLinearVelocity(
        new BABYLON.Vector3(-speed, 0, 0)
      );
      break;
    }
    case 'ArrowRight': {
      event.preventDefault();
      sphere.physicsImpostor?.setLinearVelocity(
        new BABYLON.Vector3(speed, 0, 0)
      );
      break;
    }
    case 'ArrowUp': {
      event.preventDefault();
      sphere.physicsImpostor?.setLinearVelocity(
        new BABYLON.Vector3(0, 0, speed)
      );
      break;
    }
    case 'ArrowDown': {
      event.preventDefault();
      sphere.physicsImpostor?.setLinearVelocity(
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
  camera.position.x = sphere.position.x;
  camera.position.z = sphere.position.z - 2;
  light.position.x = sphere.position.x;
  light.position.z = sphere.position.z - 2;
  camera.setTarget(sphere.position);
  const v = sphere.physicsImpostor!.getLinearVelocity()!;
  rolling.volume(Math.max(Math.abs(v.x), Math.abs(v.z)) / speed / 2);
  scene.render();
});

// the canvas/window resize event handler
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  engine.resize();
});
