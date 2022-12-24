<script lang="ts">
  import { AStar } from "./astar";
  import { BFS } from "./bfs";
  import { DFS } from "./dfs";
  import { create2d, extractLayer, layerGrid, markGrid } from "./grid";
  import type { SearchFunction } from "./search";
  import { dest_x, dest_y, dim, start_x, start_y } from "./stores";
  import Vtec from "./vtec.svelte";

  export let grid: string[][];
  export let savedWalls: boolean[][] | null;
  let stepper: NodeJS.Timer | null;

  let searchFunctions = [
    { id: 0, name: "Depth First Search", func: DFS },
    { id: 1, name: "Breadth First Search", func: BFS },
    { id: 2, name: "A* Search", func: AStar },
  ];

  let selected = 0;
  let search: SearchFunction = new searchFunctions[selected].func(
    grid,
    $dim,
    $start_x,
    $start_y,
    $dest_x,
    $dest_y
  );
  let speed = 10;

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

  const run = () => {
    savedWalls = extractLayer(grid, "X");
    if (stepper) {
      clearInterval(stepper);
      stepper = null;
    } else {
      stepper = setInterval(step, speed);
    }
  };

  const reset = () => {
    grid = create2d<string>(20);
    if (savedWalls) layerGrid(grid, savedWalls, "X");
    savedWalls = null;
    grid[$start_x][$start_y] = "s";
    grid[$dest_x][$dest_y] = "d";

    search = new searchFunctions[selected].func(
      grid,
      $dim,
      $start_x,
      $start_y,
      $dest_x,
      $dest_y
    );
    if (stepper) {
      clearInterval(stepper);
      stepper = null;
    }
  };

  $: search.setStart($start_x, $start_y);
  $: search.setDest($dest_x, $dest_y);
</script>

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
        if (search.path) {
          savedWalls = extractLayer(grid, "X");
          reset();
          savedWalls = extractLayer(grid, "X");
        }
        run();
      }}>{stepper ? "Stop" : search.path ? "Rerun" : "Run"}</button
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
    <Vtec class="stroke-slate-50 fill-slate-50" />
  </div>
</div>
