import * as BABYLON from 'babylonjs';

import Maze from '../maze';
import concreteImage from '../images/concrete.png';

export const createGround = (maze: Maze, scene: BABYLON.Scene) => {
  const ground = BABYLON.MeshBuilder.CreateGround(
    'ground',
    {width: maze.size, height: maze.size, updatable: false},
    scene
  );
  const groundMaterial = new BABYLON.StandardMaterial('ground', scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture(concreteImage, scene);
  (groundMaterial.diffuseTexture as BABYLON.Texture).uScale =
    (maze.size - 1) / 2;
  (groundMaterial.diffuseTexture as BABYLON.Texture).vScale =
    (maze.size - 1) / 2;
  ground.material = groundMaterial;
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    ground,
    BABYLON.PhysicsImpostor.BoxImpostor,
    {mass: 0, restitution: 0.9, friction: 1},
    scene
  );
  return ground;
};
