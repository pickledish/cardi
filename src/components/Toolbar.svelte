<script>

  import { currBoard, currArchived, boardMap, tiles_checked, show_new_snippet_modal } from '../store.js'

  import Icon from './Icon.svelte'
  import ToolbarButton from './ToolbarButton.svelte'
  import ChangeTagModal from './ChangeTagModal.svelte'
  import ModalCardLarge from './ModalCardLarge.svelte'

  let client = window.client;

  let show_tag_modal = false;
  let modal_action = "";

  function showModal(action) {
    modal_action = action;
    show_tag_modal = true;
  }

  function statusOrder() {
    if ($currArchived) {
      return ["archived", "current"];
    } else {
      return ["current", "archived"];
    }
  }

  async function handleBatchArchive() {
    let [from, to] = statusOrder();
    let success = await Promise.all(
      Array.from($tiles_checked).map(async (created) => {
        return await client.changeStatus(from, created, to);
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
      <ToolbarButton name="addBoard" icon="square-plus" help="Add Boards" action={() => showModal("ADD")}/>
      <ToolbarButton name="remBoard" icon="square-minus" help="Remove Boards" action={() => showModal("DELETE")}/>
      <ToolbarButton name="archive" icon="archive" help={$currArchived ? "Restore" : "Archive"} action={handleBatchArchive}/>
      <ToolbarButton name="delete" icon="trash" help="Delete" action={handleBatchDelete}/>
    </div>
  {/if}
</div>
