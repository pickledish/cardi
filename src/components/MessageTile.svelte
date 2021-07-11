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
    ? "border-sage-700 dark:border-sage-300"
    : "border-white dark:border-desk-700";

</script>

<style>

</style>

<div class="rounded shadow bg-white dark:bg-desk-700 break-words border-b-0.5rem {colors}">
  <div class="flex flex-col">
    {#if image}
    <img class="rounded-t object-contain w-full" src="{image}"/>
    {/if}
    <div class="px-5 pt-6 pb-3">
      <div class="text-lg">
        <span class="cursor-pointer" on:click={() => $shownNote = created}>
          {#if title !== null}{@html title}{:else}{content}{/if}
        </span>
      </div>
      <div class="flex justify-between pt-4">
        <div class="self-center text-xs text-grey-500 dark:text-grey-300 whitespace-nowrap">
          {created_date}
        </div>
        <div class="flex self-center text-xs whitespace-nowrap">
          {#if boards && boards.length !== 0}
            {#each Array.from(boards.values) as id}
            <span
              class="inline-block rounded bg-grey-300 dark:bg-grey-500 px-2 py-0.75 mr-1.5 text-xs cursor-pointer"
              on:click={() => $currBoard = id}
            >
              {$boardMap.get(id) && $boardMap.get(id).name}
            </span>
            {/each}
          {/if}
          <Checkbox object_id={created} object_store={tiles_checked} tag_style={true} bind:checked={is_checked}/>
        </div>
      </div>
    </div>
  </div>
</div>
