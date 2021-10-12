import * as BABYLON from 'babylonjs';

class Engine {
  canvas: HTMLCanvasElement;
  engine: BABYLON.Engine;
  windowResizeHandler: () => void;

  constructor() {
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
  }

  dispose() {
    window.removeEventListener('resize', this.windowResizeHandler);
    this.engine.dispose();
    this.canvas.remove();
  }
}

export default Engine;
