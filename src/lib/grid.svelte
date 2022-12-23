<script lang="ts">
  import Controller from "./controller.svelte";
  import { create2d } from "./grid";
  import GridSquare from "./grid-square.svelte";
  import { dest_x, dest_y, dim, start_x, start_y } from "./stores";

  let savedWalls: boolean[][] | null = null;

  let grid = create2d<string>(20);

  let settingStart = false;
  let settingEnd = false;
  let drawingWalls = false;

  $: if (!settingStart) grid[$start_x][$start_y] = "s";
  $: if (!settingEnd) grid[$dest_x][$dest_y] = "d";
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
  {#each [...Array($dim * $dim).keys()] as e}
    <GridSquare
      key={e}
      bind:grid
      bind:drawingWalls
      bind:settingStart
      bind:settingEnd
      bind:savedWalls
    />
  {/each}
</section>
<Controller bind:grid bind:savedWalls />

<style>
  * {
    user-select: none;
  }
  .grid-columns-20 {
    grid-template-columns: repeat(20, minmax(0, 1fr));
  }
</style>
