<script lang="ts">
  import { DFS } from "./dfs";
  import { create2d, getAdjacent, index1d, layerGrid, markGrid } from "./grid";
  import type { SearchFunction } from "./search";

  const dim = 20;
  const debug = false;

  let clicking = false;
  let grid = create2d(20);
  let search: SearchFunction = new DFS(grid, 11, 0, dim, "d");
  let stepper: NodeJS.Timer | null = null;
  let speed = 10;

  let settingStart = false;
  let settingEnd = false;

  grid[11][0] = "s";
  grid[11][19] = "d";

  const addWall = (idx1d: number) => {
    if (clicking) {
      const [i, j] = index1d(idx1d, dim);
      console.log(i, j);
      console.log(getAdjacent(grid, i, j));
      grid[i][j] = "X";
    }
  };

  const reset = () => {
    grid = create2d(20);
    search = new DFS(grid, 11, 0, dim, "d");
    grid[11][0] = "s";
    grid[11][19] = "d";
    if (stepper) {
      clearInterval(stepper);
      stepper = null;
    }
  };
  const step = () => {
    const visited = search.step();
    if (visited) grid = layerGrid(grid, visited, "v");
    if (search.path) {
      markGrid(grid, search.path, "p");
      if (stepper) {
        clearInterval(stepper);
        stepper = null;
      }
    }
  };
</script>

<section
  class="grid grid-columns-20 w-full max-w-5xl"
  on:mouseleave={() => {
    clicking = false;
  }}
>
  {#each [...Array(dim * dim).keys()] as e}
    <div
      class="border border-slate-500 w-full h-10 m-0"
      class:bg-sky-600={grid[index1d(e, dim)[0]][index1d(e, dim)[1]] == "v"}
      class:bg-black={grid[index1d(e, dim)[0]][index1d(e, dim)[1]] == "X"}
      class:bg-purple-400={grid[index1d(e, dim)[0]][index1d(e, dim)[1]] == "p"}
      class:bg-red-600={grid[index1d(e, dim)[0]][index1d(e, dim)[1]] == "s"}
      class:bg-green-600={grid[index1d(e, dim)[0]][index1d(e, dim)[1]] == "d"}
      on:mousedown={() => {
        clicking = true;
        addWall(e);
      }}
      on:mouseup={() => {
        clicking = false;
      }}
      on:mouseenter={() => {
        addWall(e);
      }}
    >
      {#if debug}
        {grid[index1d(e, dim)[0]][index1d(e, dim)[1]]}
      {/if}
    </div>
  {/each}
</section>
<div class="flex">
  <button
    class="px-3 py-2 rounded-md bg-slate-50 m-2 hover:bg-sky-500"
    class:bg-red-500={stepper != null}
    class:hover:bg-red-400={stepper != null}
    on:click={() => {
      if (stepper) {
        clearInterval(stepper);
        stepper = null;
      } else {
        stepper = setInterval(step, speed);
      }
    }}>{!stepper ? "Run" : "Stop"}</button
  >
  <button
    class="px-3 py-2 rounded-md bg-slate-50 m-2 hover:bg-sky-500"
    on:click={reset}>Reset</button
  >
</div>
<input
  type="range"
  class="transform rotate-180"
  min="1"
  max="500"
  bind:value={speed}
  on:change={() => {
    if (stepper) {
      clearInterval(stepper);
      stepper = setInterval(step, speed);
    }
  }}
/>

<style>
  * {
    user-select: none;
  }
  .grid-columns-20 {
    grid-template-columns: repeat(20, minmax(0, 1fr));
  }
</style>
