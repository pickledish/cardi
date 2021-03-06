<script>

  import Icon from './Icon.svelte'

  export let name = "";
  export let icon = null;
  export let help = null;
  export let action = null;

  let showHelp = false;

  function handleOver() {
    showHelp = true;
  }

  function handleOut() {
    showHelp = false;
  }

</script>

<div class="relative" on:click={action} on:mouseover={handleOver} on:mouseout={handleOut}>
  {#if showHelp}
  <div class="absolute bg-desk-900 text-grey-100 whitespace-nowrap -top-9 left-1/2 transform -translate-x-2/4 z-50 rounded px-2 py-1">
    {help}
  </div>
  {/if}
  <button id="{name}" class="mx-1 p-2 rounded shadow bg-sage-300 dark:bg-sage-700 cursor-pointer">
    {#if icon}
    <Icon kind={icon}/>
    {/if}
  </button>
</div>
