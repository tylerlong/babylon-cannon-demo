import * as CANNON from 'cannon-es';

import './index.css';

import Game from './game';

(global as unknown as {CANNON: typeof CANNON}).CANNON = CANNON;

const button = document.createElement('button');
button.style.top = '32px';
button.style.right = '32px';
button.style.width = '128px';
button.style.height = '32px';
button.style.position = 'absolute';
button.style.color = 'black';
document.body.appendChild(button);

let mazeSize = 3;
let game: Game;
const newLevel = () => {
  game?.dispose();
  game = new Game(mazeSize);
  button.textContent = `Level ${(mazeSize - 1) / 2}`;
  mazeSize += 2;
  game.once('exit', () => newLevel());
};
newLevel();
