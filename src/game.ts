import * as BABYLON from 'babylonjs';
import EventEmitter from 'events';
import Scene from './scene';

class Game extends EventEmitter {
  canvas: HTMLCanvasElement;
  engine: BABYLON.Engine;
  windowResizeHandler: () => void;
  scene: Scene;

  constructor(mazeSize: number) {
    super();
    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);

    this.engine = new BABYLON.Engine(this.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });

    this.windowResizeHandler = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.engine.resize();
    };
    window.addEventListener('resize', this.windowResizeHandler);

    this.scene = new Scene(this.engine, mazeSize, () => {
      this.emit('exit');
    });
    this.engine.runRenderLoop(() => this.scene.render());
  }

  dispose() {
    this.engine.stopRenderLoop();
    this.scene.dispose();
    window.removeEventListener('resize', this.windowResizeHandler);
    this.engine.dispose();
    this.canvas.remove();
  }
}

export default Game;
