import {shuffle} from 'lodash';

type MazeLocation = {
  z: number;
  x: number;
};

type Visited = {[key: number]: {[key: number]: boolean}};

class Maze {
  size: number;
  player: MazeLocation;
  pickup: MazeLocation;
  map: number[][] = [];

  private visited: Visited = {};

  constructor(size: number) {
    if (size % 2 === 0) {
      size += 1; // size must be odd
    }
    this.size = size;

    for (let z = 0; z < size; z++) {
      this.map[z] = [];
      for (let x = 0; x < size; x++) {
        this.map[z][x] = z % 2 === 1 && x % 2 === 1 ? 0 : 1;
      }
    }

    this.pickup = {
      x: size - 1,
      z: size - 2,
    };
    this.map[this.pickup.z][this.pickup.x] = 0;

    this.player = {
      x: 1,
      z: 1,
    };

    for (let z = 0; z < size; z++) {
      if (z % 2 === 1) {
        this.visited[z] = {};
        for (let x = 0; x < size; x++) {
          if (x % 2 === 1) {
            this.visited[z][x] = false;
          }
        }
      }
    }

    this.visit(this.player.z, this.player.x);
  }

  visit(z: number, x: number) {
    this.visited[z][x] = true;
    const neighbors = this.findNeighbors(z, x);
    for (const neighbor of neighbors) {
      if (!this.visited[neighbor.z][neighbor.x]) {
        this.map[(z + neighbor.z) / 2][(x + neighbor.x) / 2] = 0;
        this.visit(neighbor.z, neighbor.x);
      }
    }
  }

  findNeighbors(z: number, x: number): MazeLocation[] {
    if (this.map[z][x] !== 0) {
      return [];
    }
    const result: MazeLocation[] = [];
    if (z - 2 > 0) {
      result.push({z: z - 2, x});
    }
    if (x - 2 > 0) {
      result.push({z, x: x - 2});
    }
    if (z + 2 < this.size) {
      result.push({z: z + 2, x});
    }
    if (x + 2 < this.size) {
      result.push({z, x: x + 2});
    }
    return shuffle(result);
  }
}

export default Maze;
