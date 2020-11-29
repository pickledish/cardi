<script>

  export let show = false;
  export let onClose = () => {};

  function close() {
    onClose();
    show = false;
  }

</script>

{#if show}
<div class="fixed top-0 left-0 w-screen h-screen bg-grey z-10">
  <div class="h-full w-full bg-black bg-opacity-50 flex items-center justify-center" on:click|self={close}>
    <div class="w-3/4 md:w-1/2 bg-white dark:bg-desk-700 bg-opacity-100 p-8 rounded">
      <slot></slot>
    </div>
  </div>
</div>
{/if}
