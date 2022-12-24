export interface SearchFunction {
  step(): boolean[][] | null;
  readonly path: any[] | null;
  setStart(x: number, y: number): void;
  setDest(x: number, y: number): void;
}

export interface Path {
  i: number;
  j: number;
  path: any[];
}
