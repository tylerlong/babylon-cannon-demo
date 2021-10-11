import * as BABYLON from 'babylonjs';
import Maze from './maze';

export const createWalls = (maze: Maze, scene: BABYLON.Scene) => {
  for (let z = 0; z < maze.size; z++) {
    for (let x = 0; x < maze.size; x++) {
      if (maze.map[x][z] === 1) {
        createWall(
          {
            id: `${x}-${z}`,
            x: x - (maze.size - 1) / 2,
            z: z - (maze.size - 1) / 2,
          },
          scene
        );
      }
    }
  }
};

const createWall = (
  options: {id: string; x: number; z: number},
  scene: BABYLON.Scene
) => {
  const wall = BABYLON.MeshBuilder.CreateBox(
    `wall${options.id}`,
    {
      size: 1,
    },
    scene
  );
  wall.position.x += options.x;
  wall.position.y += 0.5;
  wall.position.z += options.z;
};
