import * as BABYLON from 'babylonjs';

import Maze from '../maze';

export const createPickup = (maze: Maze, scene: BABYLON.Scene) => {
  const pickup = BABYLON.MeshBuilder.CreateBox(
    'pickup',
    {
      size: 1,
    },
    scene
  );
  pickup.position = new BABYLON.Vector3(
    maze.pickup.x - (maze.size - 1) / 2 + 1,
    0.5,
    maze.pickup.z - (maze.size - 1) / 2
  );
  const pickupMaterial = new BABYLON.StandardMaterial('pickup', scene);
  pickupMaterial.alpha = 0;
  pickup.material = pickupMaterial;
  pickup.physicsImpostor = new BABYLON.PhysicsImpostor(
    pickup,
    BABYLON.PhysicsImpostor.BoxImpostor,
    {mass: 0, restitution: 0},
    scene
  );
  return pickup;
};
