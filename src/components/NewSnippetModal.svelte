<script>

  import Icon from './Icon.svelte'
  import Modal from './Modal.svelte'
  import TagSelect from './TagSelect.svelte'

  import { show_new_snippet_modal } from '../store.js'
  import { toSearchKeys } from '../util/search.js'
  import { getMetadata } from '../util/pipeline.js'
  import { isUrl } from '../util/util.js'

  let client = window.client;

  let title_str = "";
  let content = "";

  let status = "NONE";
  let selectedTags = null;

  function focus(element){
    element.focus();
  }

  async function submit() {
    try {
      status = "LOADING";

      let boards = selectedTags ? selectedTags.map(elem => elem.value) : [];

      let title = null;
      let search = [];
      let image = null;

      // always give a specified title priority over content
      if (title_str.length > 0) {
        title = title_str;
        search = toSearchKeys(title + " " + content);
      // no title but content is a URL, so get some extra metadata
      } else if (isUrl(content)) {
        let struct = await getMetadata(content);
        title = struct["title"];
        search = toSearchKeys(struct["title"]);
        image = struct["image"]
        console.log(`METADATA: ${title}, ${search}, ${image}`)
      // not a URL and no title, so search is just content
      } else {
        search = toSearchKeys(content);
      }

      let response = await client.createSnippet("current", null, title, content, boards, search, image);

      window.location.reload();
    } catch (err) {
      status = "ERROR";
      console.log(err);
    }
  }

</script>

<style>

  .rotate {
    animation: rotation 2s infinite linear;
  }

</style>


<Modal bind:show={$show_new_snippet_modal}>

  <div class="flex flex-col items-stretch text-grey-700">

    <h1 class="mb-4 text-2xl dark:text-grey-100">New Note</h1>

    <input id="title" class="p-2 rounded border" placeholder="Title (optional)" bind:value={title_str}/>

    <textarea id="content" class="p-2 my-2 rounded border" placeholder="Text or URL" bind:value={content} use:focus></textarea>

    <TagSelect bind:items={selectedTags}/>

    <div class="mt-4">
      <div class="float-right flex items-center">
        <button
          id="cancel"
          on:click="{() => $show_new_snippet_modal = false}"
          class="hover:bg-desk-300 dark:text-grey-100 py-1 px-3 rounded">
          Cancel
        </button>
        {#if status == "NONE"}
        <button
          id="submit"
          on:click="{submit}"
          class="bg-sage-300 dark:bg-sage-700 dark:text-grey-100 py-1 px-3 rounded w-16 text-center">
          Create
        </button>
        {:else if status == "LOADING"}
        <div class="bg-sage-300 dark:bg-sage-700 dark:text-grey-100 py-1 px-3 rounded w-16 flex justify-center items-center">
          <div class="rotate w-min"><Icon kind="spinny"/></div>
        </div>
        {:else if status == "ERROR"}
        <div class="bg-sage-300 dark:bg-sage-700 dark:text-grey-100 py-1 px-3 rounded w-16 flex justify-center items-center">
          <Icon kind="missing"/>
        </div>
        {:else}
        <div class="bg-sage-300 dark:bg-sage-700 dark:text-grey-100 py-1 px-3 rounded w-16 flex justify-center items-center">
          <Icon kind="sad"/>
        </div>
        {/if}
      </div>
    </div>
  </div>
</Modal>
