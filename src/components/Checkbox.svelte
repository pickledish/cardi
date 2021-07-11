<script>

  import Icon from './Icon.svelte'

  // Purpose of this checkbox is to keep global state of checked objects
  // When checked, this will add itself (as `object_id`) to the set `object_store`
  // When unchecked, it will remove `object_id` from that store

  export let checked = false;
  export let object_id = null;
  export let object_store = null;
  export let label = "";
  export let tag_style = false;

  $: colors = (tag_style)
    ? "text-black bg-grey-300 border-grey-300 dark:text-white dark:bg-grey-500 dark:border-grey-500"
    : "text-sage-700 bg-white border-desk-300 dark:text-sage-300 dark:bg-grey-700 dark:border-grey-500";

  $: opacity = (checked) ? "100" : "0";

  function handle_check_change() {
    if (object_store != null) {
      if (checked) {
        $object_store.add(object_id)
      } else {
        $object_store.delete(object_id)
      }
      // needed so that subscribers know it has changed
      $object_store = $object_store
    }
  }

</script>

<label class="flex justify-start items-start">
  <div class="{colors} border-2 rounded w-5 h-5 flex flex-shrink-0 justify-center items-center">
    <input type="checkbox" class="opacity-0 absolute" bind:checked={checked} on:change={handle_check_change}>
    <div class="pointer-events-none opacity-{opacity}">
      <Icon kind="check" size={16} width={3.0}/>
    </div>
  </div>
  <div class="select-none">{label}</div>
</label>

