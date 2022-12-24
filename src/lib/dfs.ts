import { Stack } from "js-sdsl";
import _ from "underscore";

import { create2d, getAdjacent } from "./grid";
import type { Path, SearchFunction } from "./search";

export class DFS implements SearchFunction {
  private stack: Stack<Path>;
  private grid: string[][];
  private visited: boolean[][];
  private done: boolean;
  private dest_x: number;
  private dest_y: number;
  private _path: any[] | null;
  constructor(
    grid: string[][],
    dim: number,
    start_x: number,
    start_y: number,
    dest_x: number,
    dest_y: number
  ) {
    this.stack = new Stack();
    this.visited = create2d(dim, false);
    this.done = false;
    this.grid = grid;
    this.dest_x = dest_x;
    this.dest_y = dest_y;
    this._path = null;

    this.stack.push({ i: start_x, j: start_y, path: [] });
  }
  step() {
    const e = this.stack.pop();
    if (!e || this.done) return null;
    if (_([e.i, e.j]).isEqual([this.dest_x, this.dest_y])) {
      this._path = e.path;
      this.done = true;
    }

    const adj = getAdjacent(this.grid, e.i, e.j);
    this.visited[e.i][e.j] = true;
    for (let a of adj) {
      if (!this.visited[a[0]][a[1]]) {
        this.stack.push({
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

  public setStart(x: number, y: number) {
    this.stack = new Stack();
    this.stack.push({ i: x, j: y, path: [] });
  }
  public setDest(x: number, y: number) {
    this.dest_x = x;
    this.dest_y = y;
  }
}
