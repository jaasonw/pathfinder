<script lang="ts">
  import { BFS } from "./bfs";
  import { DFS } from "./dfs";
  import { create2d, extractLayer, index1d, layerGrid, markGrid } from "./grid";
  import type { SearchFunction } from "./search";
  import Vtec from "./vtec.svelte";

  const dim = 20;
  const debug = false;

  let drawingWalls = false;
  let savedWalls: boolean[][] | null = null;

  let grid = create2d<string>(20);
  let searchFunctions = [
    { id: 0, name: "Depth First Search", func: DFS },
    { id: 1, name: "Breadth First Search", func: BFS },
  ];
  let start_x = 5;
  let start_y = 7;
  let dest_x = 17;
  let dest_y = 17;

  let selected = 0;
  let search: SearchFunction = new searchFunctions[selected].func(
    grid,
    dim,
    start_x,
    start_y,
    dest_x,
    dest_y
  );
  let stepper: NodeJS.Timer | null = null;
  let speed = 10;

  let settingStart = false;
  let settingEnd = false;

  const addWall = (idx1d: number) => {
    if (drawingWalls) {
      const [i, j] = index1d(idx1d, dim);
      if (grid[i][j] == "") grid[i][j] = "X";
    }
  };

  const reset = () => {
    grid = create2d<string>(20);
    if (savedWalls) layerGrid(grid, savedWalls, "X");
    savedWalls = null;
    grid[start_x][start_y] = "s";
    grid[dest_x][dest_y] = "d";

    search = new searchFunctions[selected].func(
      grid,
      dim,
      start_x,
      start_y,
      dest_x,
      dest_y
    );
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

  $: search.setStart(start_x, start_y);
  $: search.setDest(dest_x, dest_y);
  $: if (!settingStart) grid[start_x][start_y] = "s";
  $: if (!settingEnd) grid[dest_x][dest_y] = "d";
</script>

<section
  class="grid grid-columns-20 w-full max-w-5xl"
  on:mouseleave={() => {
    drawingWalls = false;

    // put the start point back if it leaves the grid
    settingStart = false;
    settingEnd = false;
  }}
>
  {#each [...Array(dim * dim).keys()] as e}
    <div
      class="border border-slate-500 w-full h-8 m-0"
      class:bg-sky-600={grid[index1d(e, dim)[0]][index1d(e, dim)[1]] == "v"}
      class:bg-black={grid[index1d(e, dim)[0]][index1d(e, dim)[1]] == "X"}
      class:bg-purple-400={grid[index1d(e, dim)[0]][index1d(e, dim)[1]] == "p"}
      class:bg-red-600={grid[index1d(e, dim)[0]][index1d(e, dim)[1]] == "s"}
      class:bg-green-600={grid[index1d(e, dim)[0]][index1d(e, dim)[1]] == "d"}
      class:hover:cursor-move={grid[index1d(e, dim)[0]][index1d(e, dim)[1]] ==
        "d" ||
        grid[index1d(e, dim)[0]][index1d(e, dim)[1]] == "s" ||
        settingStart ||
        settingEnd}
      class:hover:bg-red-600={settingStart}
      class:hover:bg-green-600={settingEnd}
      class:hover:opacity-80={settingStart || settingEnd}
      class:hover:scale-110={settingStart || settingEnd}
      on:mousedown={() => {
        const [i, j] = index1d(e, dim);

        // handle a click on the start square
        if (grid[i][j] == "s") {
          grid[i][j] = "";
          settingStart = true;
        } else if (grid[i][j] == "d") {
          grid[i][j] = "";
          settingEnd = true;
        }
        // handle a click on the destination square when moving it
        else if (settingEnd) {
          if (grid[i][j] == "") {
            settingEnd = false;
            dest_x = i;
            dest_y = j;
          }
        }
        // handle a click on the start square when moving it
        else if (settingStart) {
          if (grid[i][j] == "") {
            settingStart = false;
            start_x = i;
            start_y = j;
          }
        } else {
          drawingWalls = true;
          addWall(e);
        }
      }}
      on:mouseup={() => {
        const [i, j] = index1d(e, dim);
        if (settingStart) {
          settingStart = false;
          if (grid[i][j] == "") {
            start_x = i;
            start_y = j;
          }
        } else if (settingEnd) {
          settingEnd = false;
          if (grid[i][j] == "") {
            dest_x = i;
            dest_y = j;
          }
        }

        drawingWalls = false;
        savedWalls = extractLayer(grid, "X");
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
<div class="flex flex-col my-5 gap-2">
  <select
    bind:value={selected}
    on:change={(e) => {
      // changing options should never reset the walls
      savedWalls = extractLayer(grid, "X");
      reset();
      savedWalls = extractLayer(grid, "X");
    }}
  >
    {#each searchFunctions as func}
      <option value={func.id}>
        {func.name}
      </option>
    {/each}
  </select>
  <div class="flex justify-center">
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
      on:click={reset}>{savedWalls ? "Reset" : "Clear"}</button
    >
  </div>
  <div class="flex justify-center">
    <div class="text-4xl">🐢</div>
    <input
      type="range"
      class="transform rotate-180"
      min="1"
      max="100"
      bind:value={speed}
      on:change={() => {
        if (stepper) {
          clearInterval(stepper);
          stepper = setInterval(step, speed);
        }
      }}
    />
    <Vtec class="stroke-white fill-white" />
  </div>
</div>

<style>
  * {
    user-select: none;
  }
  .grid-columns-20 {
    grid-template-columns: repeat(20, minmax(0, 1fr));
  }
</style>
