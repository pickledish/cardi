<script>

  import Cookie from 'js-cookie'
  import Masonry from 'masonry-layout';

  import { onMount, afterUpdate } from 'svelte';

  import MessageTile from './MessageTile.svelte';
  import ChangeTagModal from './ChangeTagModal.svelte'
  import ModalCardLarge from './ModalCardLarge.svelte'
  import Icon from './Icon.svelte'

  import { currBoard, boardMap, noteList, tiles_checked, show_new_snippet_modal } from '../store.js';
  import { changeStatus } from '../dynamodb/note.js'
  import { documentClient } from '../dynamodb/client.js'

  let show_tag_modal = false;
  let modal_action = "";

  let masonry = null;

  onMount(setupMasonry);

  afterUpdate(updateMasonry);

  function setupMasonry() {
    masonry = new Masonry(document.querySelector('.masonry-grid'), {
      itemSelector: '.masonry-tile',
      columnWidth: '.masonry-width',
      percentPosition: true
    });
  }

  function updateMasonry() {
    if ($noteList.length > 0) {
      masonry.reloadItems();
      masonry.layout();
    }
  }

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

</script>

<style>

  input[type=checkbox] {
    position: absolute;
    visibility: hidden;
  }

</style>

<ModalCardLarge/>
<ChangeTagModal bind:show_modal={show_tag_modal} action={modal_action}/>

<div class="flex justify-between items-center w-auto h-16 mt-2">
  <h1 class="mx-2 text-3xl">{$currBoard == "" ? "ALL" : $boardMap.get($currBoard) && $boardMap.get($currBoard).name} Notes</h1>
  {#if $tiles_checked.size == 0}
    <div class="flex items-center px-4 py-2 rounded shadow bg-tealish cursor-pointer" on:click={() => $show_new_snippet_modal = true}>
      <Icon kind="plus" width={3.0}/>
      <span class="ml-2 font-bold">New Snippet</span>
    </div>
  {:else}
    <span>
      <button class="mx-2 p-2 rounded border border-gray-200 bg-gray-400" on:click={() => showModal("ADD")}>AddTag</button>
      <button class="mx-2 p-2 rounded border border-gray-200 bg-gray-400" on:click={() => showModal("REMOVE")}>RemTag</button>
      <button class="mx-2 p-2 rounded border border-gray-200 bg-gray-400" on:click={handleBatchArchive}>Archive</button>
      <button class="mx-2 p-2 rounded border border-gray-200 bg-gray-400">Delete</button>
    </span>
  {/if}
</div>

<div class="">
  <div class="masonry-grid flex flex-wrap mb-4 -mx-3">
    {#each $noteList as message}
      <div class="masonry-tile masonry-width w-full md:w-1/2 lg:w-1/3">
        <div class="m-3">
          <MessageTile {...message}/>
        </div>
      </div>
    {:else}
      No messages found! Check console for errors
    {/each}
  </div>
</div>
