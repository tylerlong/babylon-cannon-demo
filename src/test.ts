import Maze from './maze';

const maze = new Maze(11);

console.log(maze.size);
for (const line of maze.map) {
  console.log(line.join(', '));
}
console.log(maze.player);
console.log(maze.pickup);
