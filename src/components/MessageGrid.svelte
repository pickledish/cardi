<script>

  import Cookie from 'js-cookie'
  import Masonry from 'masonry-layout';
  import imagesLoaded from 'imagesloaded';

  import { onMount, afterUpdate } from 'svelte';

  import MessageTile from './MessageTile.svelte';
  import ChangeTagModal from './ChangeTagModal.svelte'
  import ModalCardLarge from './ModalCardLarge.svelte'
  import Icon from './Icon.svelte'

  import { currBoard, boardMap, noteList, tiles_checked, show_new_snippet_modal } from '../store.js';
  import { changeStatus, deleteSnippet } from '../dynamodb/note.js'
  import { documentClient } from '../dynamodb/client.js'

  let show_tag_modal = false;
  let modal_action = "";

  let masonry = null;

  onMount(setupMasonry);

  afterUpdate(updateMasonry);

  function setupMasonry() {
    imagesLoaded(document.querySelectorAll('img'), function(instance) {
      masonry = new Masonry(document.querySelector('.masonry-grid'), {
        itemSelector: '.masonry-tile',
        columnWidth: '.masonry-width',
        percentPosition: true
      });
    });
  }

  function updateMasonry() {
    if ($noteList.length > 0) {
      imagesLoaded(document.querySelectorAll('img'), function(instance) {
        masonry.reloadItems();
        masonry.layout();
      });
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

<style>

  input[type=checkbox] {
    position: absolute;
    visibility: hidden;
  }

</style>

<ModalCardLarge/>
<ChangeTagModal bind:show_modal={show_tag_modal} action={modal_action}/>

<div class="flex justify-between items-center w-auto h-16 mt-2">
  <h1 class="mx-2 text-3xl">
    {#if $currBoard == ""}
      All Notes
    {:else if $currBoard == "none"}
      Untagged Notes
    {:else}
      {$boardMap.get($currBoard) && $boardMap.get($currBoard).name} Notes
    {/if}
  </h1>
  {#if $tiles_checked.size == 0}
    <div class="flex items-center pl-3 pr-2 py-2 rounded shadow bg-tealish cursor-pointer" on:click={() => $show_new_snippet_modal = true}>
      <Icon kind="plus" width={3.0}/>
      <span class="mx-2 font-bold">New Snippet</span>
    </div>
  {:else}
    <span>
      <button class="mx-1 p-2 rounded shadow bg-tealish cursor-pointer" on:click={() => showModal("ADD")}>
        <Icon kind="square-plus"/>
      </button>
      <button class="mx-1 p-2 rounded shadow bg-tealish cursor-pointer" on:click={() => showModal("DELETE")}>
        <Icon kind="square-minus"/>
      </button>
      <button class="mx-1 p-2 rounded shadow bg-tealish cursor-pointer" on:click={handleBatchArchive}>
        <Icon kind="archive"/>
      </button>
      <button class="mx-1 p-2 rounded shadow bg-tealish cursor-pointer" on:click={handleBatchDelete}>
        <Icon kind="trash"/>
      </button>
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
