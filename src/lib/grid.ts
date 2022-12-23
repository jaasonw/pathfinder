export function create2d<Type>(n: number, initial: any = ""): Type[][] {
  return [...Array<Type>(n)].map((_) => Array<Type>(n).fill(initial));
}

/**
 * Utility function to map 2d array indices to a 1d array. Given the number of
 * columns and the 2d array index to map, returns the index of the
 * element in the 1d array
 */
export function index2d(i: number, j: number, dim: number) {
  return dim * i + j;
}

/**
 * The inverse function of index2d(), given the index on a 1d array and the
 * number of columns, return its index in the 2d array as a tuple
 */
export function index1d(x: number, dim: number) {
  const i = Math.floor(x / dim);
  const j = x % dim;
  return [i, j];
}

/**
 * Given a 2d matrix, return the indices adjacent to the given coordinates
 * @param grid
 * @param i
 * @param j
 */
export function getAdjacent(grid: string[][], i: number, j: number) {
  const indices = [
    [i, j - 1],
    [i, j + 1],
    [i - 1, j],
    [i + 1, j],
  ];

  // chatgpt smarter than me fr wtf
  return indices.filter(([x, y]) => {
    return (
      x >= 0 &&
      x < grid.length &&
      y >= 0 &&
      y < grid[i].length &&
      grid[x][y] != "X"
    );
  });
}

export function markGrid(grid: any[][], coords: any[], value: string) {
  for (let c of coords) {
    grid[c[0]][c[1]] = value;
  }
  return grid;
}

export function layerGrid(grid: any[][], overlay: boolean[][], value: string) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (overlay[i][j]) {
        grid[i][j] = value;
      }
    }
  }
  return grid;
}

export function extractLayer(grid: any[][], extract: string): boolean[][] {
  const layer = create2d<boolean>(grid.length, false);
  for (let i = 0; i < layer.length; ++i) {
    for (let j = 0; j < layer.length; ++j) {
      layer[i][j] = grid[i][j] == extract;
    }
  }
  return layer;
}
