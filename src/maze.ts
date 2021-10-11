import {shuffle} from 'lodash';

type MazeLocation = {
  x: number;
  z: number;
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

    for (let x = 0; x < size; x++) {
      this.map[x] = [];
      for (let z = 0; z < size; z++) {
        this.map[x][z] = x % 2 === 1 && z % 2 === 1 ? 0 : 1;
      }
    }

    this.pickup = {
      x: size - 1,
      z: size - 2,
    };
    this.map[this.pickup.x][this.pickup.z] = 0;

    this.player = {
      x: 1,
      z: 1,
    };

    for (let x = 0; x < size; x++) {
      if (x % 2 === 1) {
        this.visited[x] = {};
        for (let z = 0; z < size; z++) {
          if (z % 2 === 1) {
            this.visited[x][z] = false;
          }
        }
      }
    }

    this.visit(this.player.x, this.player.z);
  }

  visit(x: number, z: number) {
    this.visited[x][z] = true;
    const neighbors = this.findNeighbors(x, z);
    for (const neighbor of neighbors) {
      if (!this.visited[neighbor.x][neighbor.z]) {
        this.map[(x + neighbor.x) / 2][(z + neighbor.z) / 2] = 0;
        this.visit(neighbor.x, neighbor.z);
      }
    }
  }

  findNeighbors(x: number, z: number): MazeLocation[] {
    if (this.map[x][z] !== 0) {
      return [];
    }
    const result: MazeLocation[] = [];
    if (x - 2 > 0) {
      result.push({x: x - 2, z});
    }
    if (z - 2 > 0) {
      result.push({x, z: z - 2});
    }
    if (x + 2 < this.size) {
      result.push({x: x + 2, z});
    }
    if (z + 2 < this.size) {
      result.push({x, z: z + 2});
    }
    return shuffle(result);
  }
}

export default Maze;
