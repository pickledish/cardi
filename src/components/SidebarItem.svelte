<script>

  import Icon from './Icon.svelte'

  export let icon = "missing";
  export let text = "Sidebar Item";
  export let selected = "";
  export let action = null;

  // One more prop is a slot, which is the content on the rightmost
  // section of the sidebar elemen.

</script>

<div on:click={action}>
  <div class="relative p-2 ml-4 text-md rounded cursor-pointer hover:bg-desk-300 dark:hover:bg-desk-700">
    {#if selected}<div class="absolute -left-0.5 bg-sage-700 dark:bg-sage-300 rounded">&nbsp;</div>{/if}
    <div class="flex justify-between items-center">
      <div class="flex justify-between items-center">
        <Icon kind={icon}/>
        <span class="px-2 {selected ? "font-bold" : ""}">{text}</span>
      </div>
      <span class="font-bold text-sm">
        <slot></slot>
      </span>
    </div>
  </div>
</div>
