<script>
  import "../app.css";
</script>

<svelte:head>
  <title>title</title>
</svelte:head>
<div class="h-screen w-screen">
  <div class="flex flex-col items-center w-full py-8">
    <slot />
    <div class="flex justify-end w-screen max-w-5xl">
      <div class="flex flex-col text-right">
        <div class="text-slate-50">created by jasonw</div>
        <a
          href="https://github.com/jaasonw/pathfinder"
          class="text-sky-500 hover:text-sky-300">view source on github</a
        >
        <a
          href="https://jason-wong.me/donate"
          class="text-sky-500 hover:text-sky-300">buy me a coffee</a
        >
      </div>
    </div>
  </div>
</div>
