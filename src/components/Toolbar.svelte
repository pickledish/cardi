<script>

  import Cookie from 'js-cookie'

  import { currBoard, boardMap, tiles_checked, show_new_snippet_modal } from '../store.js';
  import { changeStatus, deleteSnippet } from '../dynamodb/note.js'
  import { documentClient } from '../dynamodb/client.js'

  import Icon from './Icon.svelte'
  import ToolbarButton from './ToolbarButton.svelte'
  import ChangeTagModal from './ChangeTagModal.svelte'
  import ModalCardLarge from './ModalCardLarge.svelte'

  let show_tag_modal = false;
  let modal_action = "";

  function showModal(action) {
    modal_action = action;
    show_tag_modal = true;
  }

  async function handleBatchArchive() {
    let accessKey = Cookie.get('awsAccessKey');
    let secretKey = Cookie.get('awsSecretKey');
    let client = documentClient(accessKey, secretKey);
    let success = await Promise.all(
      Array.from($tiles_checked).map(async (created) => {
        return await changeStatus(client, "current", created, "archived");
      })
    );
    window.location.reload();
  }

  async function handleBatchDelete() {
    let accessKey = Cookie.get('awsAccessKey');
    let secretKey = Cookie.get('awsSecretKey');
    let client = documentClient(accessKey, secretKey);
    let ok = window.confirm("Are you sure you want to delete notes?");
    if (ok) {
      let success = await Promise.all(
        Array.from($tiles_checked).map(async (created) => {
          return await deleteSnippet(client, created);
        })
      );
      window.location.reload();
    }
  }

</script>

<ModalCardLarge/>
<ChangeTagModal bind:show_modal={show_tag_modal} action={modal_action}/>

<div class="flex justify-between items-center w-auto h-16 mt-1">
  <h1 class="mx-2 text-2xl capitalize">
    {#if $currBoard == ""}
      All Notes
    {:else if $currBoard == "none"}
      Untagged Notes
    {:else}
      {$boardMap.get($currBoard) && $boardMap.get($currBoard).name} Notes
    {/if}
  </h1>
  {#if $tiles_checked.size == 0}
    <div class="flex items-center pl-3 pr-2 py-2 rounded shadow bg-sage-300 dark:bg-sage-700 cursor-pointer" on:click={() => $show_new_snippet_modal = true}>
      <Icon kind="plus" width={3.0}/>
      <button id="create" class="mx-2 font-bold whitespace-nowrap">New Note</button>
    </div>
  {:else}
    <div class="flex items-center justify-between whitespace-nowrap">
      <ToolbarButton name="addBoard" icon="square-plus" help="Add Tags" action={() => showModal("ADD")}/>
      <ToolbarButton name="remBoard" icon="square-minus" help="Remove Tags" action={() => showModal("DELETE")}/>
      <ToolbarButton name="archive" icon="archive" help="Archive" action={handleBatchArchive}/>
      <ToolbarButton name="delete" icon="trash" help="Delete" action={handleBatchDelete}/>
    </div>
  {/if}
</div>
