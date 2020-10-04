<script>

  import Cookie from 'js-cookie'

  import Modal from './Modal.svelte'
  import TagSelect from './TagSelect.svelte'

  import { tiles_checked, noteMap } from '../store.js';
  import { changeBoards } from '../dynamodb/note.js'
  import { documentClient } from '../dynamodb/client.js'

  export let show_modal = false;
  export let action; // "ADD" or "DELETE"

  let selected = null;

  async function submit() {

    let boardIds = selected ? selected.map(elem => elem.value) : [];

    let accessKey = Cookie.get('awsAccessKey');
    let secretKey = Cookie.get('awsSecretKey');
    let client = documentClient(accessKey, secretKey);

    let success = await Promise.all(
      Array.from($tiles_checked).map(async (created) => {
        let fullSnippet = $noteMap.get(created);
        return await changeBoards(client, fullSnippet.status, created, boardIds, action);
      })
    );

    window.location.reload();
  }

</script>

<Modal bind:show={show_modal}>
  <div class="flex flex-col items-stretch">

    <h1 class="mb-2 text-3xl">{action} Tags</h1>

    <TagSelect bind:items={selected}/>

    <div class="mt-2">
      <span class="float-right">
        <button
          on:click="{() => show_modal = false}"
          class="bg-gray-500 hover:bg-gray-600 py-1 px-3 rounded">
          Cancel
        </button>
        <button
          on:click="{() => submit()}"
          class="bg-green-500 hover:bg-green-700 py-1 px-3 rounded">
          Submit
        </button>
      </span>
    </div>
  </div>
</Modal>
