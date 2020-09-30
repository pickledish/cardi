<script>

  import dayjs from 'dayjs'

  import { tiles_checked, boardMap, currBoard, shownNote } from '../store.js'

  import Checkbox from './Checkbox.svelte'

  export let created = 0;
  export let updated = 0;
  export let content;
  export let status;
  export let title = null;
  export let boards = [];
  export let search = [];
  export let kind = "NOTE"

  $: created_date = dayjs(created).format('MMM D, YYYY');

  let is_checked = false;
  $: bgcolor = (is_checked) ? "bg-red-200" : "bg-white"

</script>

<style>

</style>

<div class="rounded shadow border border-gray-100 {bgcolor} break-words p-5">
  <div class="flex flex-col -my-2">
    <div class="flex justify-between">
      <div class="pt-2 py-1 text-xs">
        <Checkbox object_id={created} object_store={tiles_checked} bind:checked={is_checked}/>
      </div>
      <div class="pt-2 py-1 text-xs">
        {created_date}
      </div>
    </div>
    <div class="py-2">
      <span class="text-lg" on:click={() => $shownNote = created}>
        {#if title !== null}{title}{:else}{content}{/if}
      </span>
    </div>
    {#if boards && boards.length !== 0}
    <div class="py-2">
      {#each Array.from(boards.values) as id}
      <span
        class="inline-block rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 mr-2 cursor-pointer"
        on:click={() => $currBoard = id}
      >
        {$boardMap.get(id) && $boardMap.get(id).name}
      </span>
      {/each}
    </div>
    {/if}
  </div>
</div>
