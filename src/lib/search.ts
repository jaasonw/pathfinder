// export abstract class SearchFunction {
//   constructor(grid: string[][], x: number, y: number, dim: number) {}
//   step(): {}
// }

export interface SearchFunction {
  step(): boolean[][] | null;
  readonly path: any[] | null;
}
