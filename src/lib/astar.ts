import { PriorityQueue } from "js-sdsl";
import _ from "underscore";

import { create2d, getAdjacent } from "./grid";
import type { Path, SearchFunction } from "./search";

class AStarPath {
  readonly i: number;
  readonly j: number;
  readonly path: any[];
  readonly cost: number;
  constructor(x: number, y: number, path: any[], cost: number) {
    this.i = x;
    this.j = y;
    this.path = path;
    this.cost = cost;
  }
  valueOf() {
    return this.cost;
  }
}

export class AStar implements SearchFunction {
  private queue: PriorityQueue<AStarPath>;
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
    this.queue = new PriorityQueue([], (x, y) => x - y);
    this.visited = create2d(dim, false);
    this.done = false;
    this.grid = grid;
    this.dest_x = dest_x;
    this.dest_y = dest_y;
    this._path = null;

    this.queue.push(
      new AStarPath(start_x, start_y, [], this.distanceToDest(start_x, start_y))
    );
  }
  step() {
    let e: AStarPath | undefined;
    do {
      e = this.queue.pop();
    } while (e && this.visited[e.i][e.j]);
    if (!e || this.done) return null;
    if (_([e.i, e.j]).isEqual([this.dest_x, this.dest_y])) {
      this._path = e.path;
      this.done = true;
    }

    const adj = getAdjacent(this.grid, e.i, e.j);
    this.visited[e.i][e.j] = true;
    for (let a of adj) {
      if (!this.visited[a[0]][a[1]]) {
        this.queue.push(
          new AStarPath(
            a[0],
            a[1],
            [...e.path, [e.i, e.j]],
            this.distanceToDest(a[0], a[1])
          )
        );
      }
    }
    return this.visited;
  }

  public get path() {
    return this._path;
  }

  public setStart(x: number, y: number) {
    this.queue = new PriorityQueue([], (x, y) => x - y);
    this.queue.push(new AStarPath(x, y, [], this.distanceToDest(x, y)));
  }

  public setDest(x: number, y: number) {
    this.dest_x = x;
    this.dest_y = y;
  }

  private distanceToDest(x: number, y: number) {
    const a = x - this.dest_x;
    const b = y - this.dest_y;
    return Math.sqrt(a * a + b * b);
  }
}
