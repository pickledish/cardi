<script>

  export let show = false;

  function toggleModal() {
    show = !show;
  }

</script>

{#if show}
<div class="fixed top-0 left-0 w-screen h-screen bg-grey z-10">
  <div class="h-full w-full bg-black bg-opacity-50 flex items-center justify-center" on:click|self={toggleModal}>
    <div class="w-3/4 md:w-1/2 bg-white bg-opacity-100 p-8 rounded">
      <slot></slot>
    </div>
  </div>
</div>
{/if}
