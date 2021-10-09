import {
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  TextureLoader,
  WebGLRenderer,
} from 'three';

import ballImage from './ball.png';
import groundImage from './ground.png';

class ThreeManager {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  ballMesh: Mesh;

  constructor() {
    this.scene = new Scene();
    const textureLoader = new TextureLoader();

    const light = new PointLight(0xffffff, 1);
    light.position.set(1, 1, 5);
    this.scene.add(light);

    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      100
    );
    this.camera.position.z = 5;
    this.scene.add(this.camera);

    const ballTexture = textureLoader.load(ballImage);
    const ballMaterial = new MeshPhongMaterial({map: ballTexture});
    const geometry = new SphereGeometry(1);
    this.ballMesh = new Mesh(geometry, ballMaterial);
    this.scene.add(this.ballMesh);

    const ground = new PlaneGeometry(100, 100);
    const groundTexture = textureLoader.load(groundImage);
    groundTexture.wrapS = groundTexture.wrapT = RepeatWrapping;
    groundTexture.repeat.set(20, 20);
    const groundMaterial = new MeshPhongMaterial({map: groundTexture});
    const groundMesh = new Mesh(ground, groundMaterial);
    this.scene.add(groundMesh);

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(800, 600);
    document.body.appendChild(this.renderer.domElement);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

export default ThreeManager;
