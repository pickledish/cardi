<script>

  import Cookie from 'js-cookie'
  import Modal from './Modal.svelte'
  import TagSelect from './TagSelect.svelte'

  import { show_new_snippet_modal } from '../store.js'
  import { documentClient } from '../dynamodb/client.js'
  import { createSnippet } from '../dynamodb/note.js'
  import { toSearchKeys } from '../search.js'
  import { getTitle } from '../pipeline.js'
  import { isUrl } from '../util.js'

  let title_str = "";
  let content = "";

  let selected = null;

  async function submit() {
    try {
      let boards = selected ? selected.map(elem => elem.value) : [];

      let title = "";
      let search = [];

      if (title_str == "" && isUrl(content)) {
        console.log("Determined this is a URL, fetching title...");
        title = await getTitle(content);
        search = toSearchKeys(title); // don't get keys from the URL
      } else {
        search = toSearchKeys(title + " " + content);
      }

      let accessKey = Cookie.get('awsAccessKey');
      let secretKey = Cookie.get('awsSecretKey');
      let client = documentClient(accessKey, secretKey);
      let response = await createSnippet(client, "current", null, title, content, boards, search);

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

</script>


<Modal bind:show={$show_new_snippet_modal}>
  <div class="flex flex-col items-stretch">

    <h1 class="mb-2 text-3xl">New Snippet</h1>

    <input class="my-2 p-2 rounded border" placeholder="Title (optional)" bind:value={title_str}/>

    <textarea class="my-2 p-2 rounded border" placeholder="Snippet" bind:value={content}></textarea>

    <TagSelect bind:items={selected}/>

    <div class="mt-2">
      <span class="float-right">
        <button
          on:click="{() => $show_new_snippet_modal = false}"
          class="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded">
          Cancel
        </button>
        <button
          on:click="{submit}"
          class="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded">
          Submit
        </button>
      </span>
    </div>
  </div>
</Modal>
