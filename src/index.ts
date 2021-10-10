import ThreeManager from './three-manager';
import CannonManager from './cannon-manager';

const threeManager = new ThreeManager();
const cannonManager = new CannonManager();
animate();

function animate() {
  requestAnimationFrame(animate);
  cannonManager.updatePhysics(threeManager);
  threeManager.render();
}
