<script>

  import dayjs from 'dayjs'

  import { noteMap, boardMap, currBoard } from '../store.js'

  export let created;

  $: fullNote = $noteMap.get(created);

  $: created_date = fullNote && dayjs(fullNote.created).format('MMM D, YYYY');
  $: updated_date = fullNote && dayjs(fullNote.updated).format('MMM D, YYYY');

</script>

<div>
  <div class="flex items-center justify-between">
    <span class="text-2xl">{fullNote.title || "(no title)"}</span>
    <span>[edit]</span>
  </div>
  <div>
    {created_date} && {updated_date}
  </div>
  <div>
    {fullNote.content}
  </div>
  {#if fullNote.boards.length !== 0}
  <div class="py-2">
    {#each Array.from(fullNote.boards.values) as id}
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
