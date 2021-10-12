import * as BABYLON from 'babylonjs';

import Maze from '../maze';
import ballImage from '../images/tile.jpeg';

export const createBall = (maze: Maze, scene: BABYLON.Scene) => {
  const ball = BABYLON.MeshBuilder.CreateSphere(
    'ball',
    {segments: 16, diameter: 0.4, sideOrientation: BABYLON.Mesh.FRONTSIDE},
    scene
  );
  ball.position = new BABYLON.Vector3(
    maze.player.x - (maze.size - 1) / 2,
    0.2,
    maze.player.z - (maze.size - 1) / 2
  );
  const ballMaterial = new BABYLON.StandardMaterial('ball', scene);
  ballMaterial.diffuseTexture = new BABYLON.Texture(ballImage, scene);
  ball.material = ballMaterial;
  ball.physicsImpostor = new BABYLON.PhysicsImpostor(
    ball,
    BABYLON.PhysicsImpostor.SphereImpostor,
    {mass: 1, restitution: 0.9, friction: 1},
    scene
  );

  const speed = 3;
  window.addEventListener('keydown', event => {
    switch (event.key) {
      case 'ArrowLeft': {
        event.preventDefault();
        ball.physicsImpostor?.setLinearVelocity(
          new BABYLON.Vector3(-speed, 0, 0)
        );
        break;
      }
      case 'ArrowRight': {
        event.preventDefault();
        ball.physicsImpostor?.setLinearVelocity(
          new BABYLON.Vector3(speed, 0, 0)
        );
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        ball.physicsImpostor?.setLinearVelocity(
          new BABYLON.Vector3(0, 0, speed)
        );
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        ball.physicsImpostor?.setLinearVelocity(
          new BABYLON.Vector3(0, 0, -speed)
        );
        break;
      }
      default: {
        break;
      }
    }
  });

  return ball;
};
