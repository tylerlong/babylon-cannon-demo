import * as BABYLON from 'babylonjs';

export const createWalls = (scene: BABYLON.Scene) => {
  let id = 0;
  createWall({id: ++id, x: -2.5, z: 1}, scene);
  createWall({id: ++id, x: -1.5, z: 2}, scene);
  createWall({id: ++id, x: -0.5, z: 1}, scene);
  createWall({id: ++id, x: 0.5, z: 1}, scene);
  createWall({id: ++id, x: 1.5, z: 2}, scene);
  createWall({id: ++id, x: 2.5, z: 1}, scene);
};

const createWall = (
  options: {id: number; x: number; z: number},
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
