import { create2d, getAdjacent } from "./grid";
import type { SearchFunction } from "./search";
import { Queue } from "js-sdsl";

interface Path {
  i: number;
  j: number;
  path: any[];
}

export class BFS implements SearchFunction {
  private queue: Queue<Path>;
  private grid: string[][];
  private visited: boolean[][];
  private done: boolean;
  private dest: string;
  private _path: any[] | null;
  constructor(
    grid: string[][],
    start_x: number,
    start_y: number,
    dim: number,
    dest: string
  ) {
    this.queue = new Queue();
    this.visited = create2d(dim, false);
    this.done = false;
    this.grid = grid;
    this.dest = dest;
    this._path = null;

    this.queue.push({ i: start_x, j: start_y, path: [] });
  }
  step() {
    let e: Path | undefined;
    do {
      e = this.queue.pop();
    } while (e && this.visited[e.i][e.j]);
    if (!e || this.done) return null;
    if (this.grid[e.i][e.j] == this.dest) {
      this._path = e.path;
      this.done = true;
    }

    const adj = getAdjacent(this.grid, e.i, e.j);
    this.visited[e.i][e.j] = true;
    for (let a of adj) {
      if (!this.visited[a[0]][a[1]]) {
        this.queue.push({
          i: a[0],
          j: a[1],
          path: [...e.path, [e.i, e.j]],
        });
      }
    }
    return this.visited;
  }

  public get path() {
    return this._path;
  }
}
