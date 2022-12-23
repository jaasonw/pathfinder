export interface SearchFunction {
  // new (params: SearchParams): void;
  step(): boolean[][] | null;
  readonly path: any[] | null;
  setStart(x: number, y: number): void;
  setDest(x: number, y: number): void;
}
