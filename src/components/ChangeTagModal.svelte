<script>

  import Modal from './Modal.svelte'
  import TagSelect from './TagSelect.svelte'

  import { tiles_checked, noteMap } from '../store.js';

  export let show_modal = false;
  export let action; // "ADD" or "DELETE"

  let client = window.client;

  let selected = null;

  async function submit() {

    let boardIds = selected ? selected.map(elem => elem.value) : [];

    let success = await Promise.all(
      Array.from($tiles_checked).map(async (created) => {
        let fullSnippet = $noteMap.get(created);
        return await client.changeBoards(fullSnippet.status, created, boardIds, action);
      })
    );

    window.location.reload();
  }

</script>

<Modal bind:show={show_modal}>
  <div class="flex flex-col items-stretch text-grey-700">

    <h1 class="mb-4 text-2xl dark:text-grey-100">{action} Boards</h1>

    <TagSelect bind:items={selected}/>

    <div class="mt-4">
      <span class="float-right">
        <button
          on:click="{() => show_modal = false}"
          class="hover:bg-desk-300 dark:text-grey-100 py-1 px-3 rounded">
          Cancel
        </button>
        <button
          on:click="{() => submit()}"
          class="bg-sage-300 dark:bg-sage-700 dark:text-grey-100 py-1 px-3 rounded">
          Submit
        </button>
      </span>
    </div>
  </div>
</Modal>
