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
  export let image = "";

  $: created_date = dayjs(created).format('MMM D, YYYY');

  let is_checked = false;
  $: colors = (is_checked)
    ? "bg-red-200 border-red-400 dark:bg-red-700 dark:border-red-900"
    : "bg-white border-grey-100 dark:bg-grey-700 dark:border-grey-900";

</script>

<style>

</style>

<div class="rounded shadow border {colors} break-words p-5">
  <div class="flex flex-col">
    <div class="flex justify-between">
      <div class="text-xs">
        <Checkbox object_id={created} object_store={tiles_checked} bind:checked={is_checked}/>
      </div>
      <div class="text-xs">
        {created_date}
      </div>
    </div>
    {#if image}
    <img class="object-contain w-full pt-4" src="{image}"/>
    {/if}
    <div class="pt-4">
      <span class="text-lg" on:click={() => $shownNote = created}>
        {#if title !== null}{@html title}{:else}{content}{/if}
      </span>
    </div>
    {#if boards && boards.length !== 0}
    <div class="pt-3">
      {#each Array.from(boards.values) as id}
      <span
        class="inline-block rounded bg-grey-300 dark:bg-grey-500 px-2 py-1 text-xs mr-2 cursor-pointer"
        on:click={() => $currBoard = id}
      >
        {$boardMap.get(id) && $boardMap.get(id).name}
      </span>
      {/each}
    </div>
    {/if}
  </div>
</div>
