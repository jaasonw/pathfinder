export interface SearchFunction {
  // new (params: SearchParams): void;
  step(): boolean[][] | null;
  readonly path: any[] | null;
}
