<script>

  import Masonry from 'masonry-layout';
  import imagesLoaded from 'imagesloaded';

  import { onMount, afterUpdate } from 'svelte';

  import { noteList } from '../store.js';
  import { documentClient } from '../dynamodb/client.js'
  import { changeStatus, deleteSnippet } from '../dynamodb/note.js'

  import MessageTile from './MessageTile.svelte';
  import Toolbar from './Toolbar.svelte'

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

</script>

<style>

  input[type=checkbox] {
    position: absolute;
    visibility: hidden;
  }

</style>

<div class="w-full md:w-4/5 mx-2 p-2">

  <Toolbar/>

  <div class="">
    <div class="masonry-grid flex flex-wrap mb-4 -mx-3">
      {#each $noteList as message}
        <div class="masonry-tile masonry-width w-full md:w-1/2 lg:w-1/3">
          <div class="m-2.5">
            <MessageTile {...message}/>
          </div>
        </div>
      {:else}
        No messages found! Check console for errors
      {/each}
    </div>
  </div>

</div>
