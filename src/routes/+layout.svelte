<script>
  import "../app.css";
</script>

<svelte:head>
  <title>title</title>
</svelte:head>
<div class="h-screen w-screen bg-slate-800">
  <div class="flex flex-col items-center w-full">
    <slot />
  </div>
</div>
