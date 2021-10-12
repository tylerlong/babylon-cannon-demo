import * as CANNON from 'cannon-es';

import './index.css';

import Scene from './scene';
import Engine from './engine';

(global as unknown as {CANNON: typeof CANNON}).CANNON = CANNON;

let scene: Scene;

let mazeSize = 5;
let engine: Engine;
const newLevel = () => {
  if (engine) {
    engine.dispose();
  }
  engine = new Engine();
  scene = new Scene(engine.engine, mazeSize, newLevel);
  mazeSize += 2;
  engine.engine.runRenderLoop(() => {
    scene.render();
  });
};
newLevel();
