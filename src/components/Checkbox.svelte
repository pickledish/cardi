<script>

  import Icon from './Icon.svelte'

  // Purpose of this checkbox is to keep global state of checked objects
  // When checked, this will add itself (as `object_id`) to the set `object_store`
  // When unchecked, it will remove `object_id` from that store

  export let checked = false;
  export let object_id = null;
  export let object_store = null;
  export let label = "";

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

<style>
  input:checked + .checkdiv {
    display: block;
  }
</style>

<label class="flex justify-start items-start">
  <div class="bg-white border-2 rounded border-gray-400 w-5 h-5 flex flex-shrink-0 justify-center items-center">
    <input type="checkbox" class="opacity-0 absolute" bind:checked={checked} on:change={handle_check_change}>
    <div class="hidden pointer-events-none checkdiv">
      <Icon kind="check" size={18} width={3.0}/>
    </div>
  </div>
  <div class="select-none">{label}</div>
</label>

