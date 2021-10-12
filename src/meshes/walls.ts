import * as BABYLON from 'babylonjs';

import Maze from '../maze';
import stoneImage from '../images/stone.png';

export const createWalls = (maze: Maze, scene: BABYLON.Scene) => {
  const boxes: BABYLON.Mesh[] = [];
  for (let x = 0; x < maze.size; x++) {
    for (let z = 0; z < maze.size; z++) {
      if (maze.map[x][z] === 1) {
        const wall = createWall(
          {
            id: `${x}-${z}`,
            x: x - (maze.size - 1) / 2,
            z: z - (maze.size - 1) / 2,
          },
          scene
        );
        boxes.push(wall);
      }
    }
  }
  const walls = BABYLON.Mesh.MergeMeshes(boxes)!;
  const wallMaterial = new BABYLON.StandardMaterial('wall', scene);
  wallMaterial.diffuseTexture = new BABYLON.Texture(stoneImage, scene);
  walls.material = wallMaterial;
  walls.physicsImpostor = new BABYLON.PhysicsImpostor(
    walls,
    BABYLON.PhysicsImpostor.MeshImpostor,
    {mass: 0, restitution: 0},
    scene
  );
  return walls;
};

const createWall = (
  options: {id: string; z: number; x: number},
  scene: BABYLON.Scene
) => {
  const wall = BABYLON.MeshBuilder.CreateBox(
    `wall${options.id}`,
    {
      size: 1,
    },
    scene
  );
  wall.position.z += options.z;
  wall.position.y += 0.5;
  wall.position.x += options.x;
  return wall;
};
