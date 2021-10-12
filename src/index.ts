import * as CANNON from 'cannon-es';

import './index.css';

import Game from './game';

(global as unknown as {CANNON: typeof CANNON}).CANNON = CANNON;

let mazeSize = 3;
let game: Game;
const newLevel = () => {
  game?.dispose();
  game = new Game(mazeSize);
  mazeSize += 2;
  game.once('exit', () => newLevel());
};
newLevel();
