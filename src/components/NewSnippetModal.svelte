<script>

  import Cookie from 'js-cookie'
  import Modal from './Modal.svelte'
  import TagSelect from './TagSelect.svelte'

  import { show_new_snippet_modal } from '../store.js'
  import { documentClient } from '../dynamodb/client.js'
  import { createSnippet } from '../dynamodb/note.js'
  import { toSearchKeys } from '../search.js'
  import { getMetadata } from '../pipeline.js'
  import { isUrl } from '../util.js'

  let title_str = "";
  let content = "";

  let selected = null;

  async function submit() {
    try {
      let boards = selected ? selected.map(elem => elem.value) : [];

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

      let accessKey = Cookie.get('awsAccessKey');
      let secretKey = Cookie.get('awsSecretKey');
      let client = documentClient(accessKey, secretKey);

      let response = await createSnippet(client, "current", null, title, content, boards, search, image);

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

</script>


<Modal bind:show={$show_new_snippet_modal}>
  <div class="flex flex-col items-stretch text-grey-700">

    <h1 class="mb-2 text-3xl dark:text-grey-100">New Snippet</h1>

    <input id="title" class="p-2 rounded border" placeholder="Title (optional)" bind:value={title_str}/>

    <textarea id="content" class="p-2 my-2 rounded border" placeholder="Snippet" bind:value={content}></textarea>

    <TagSelect bind:items={selected}/>

    <div class="mt-2">
      <span class="float-right">
        <button
          id="cancel"
          on:click="{() => $show_new_snippet_modal = false}"
          class="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded">
          Cancel
        </button>
        <button
          id="submit"
          on:click="{submit}"
          class="bg-teal-300 dark:bg-teal-700 text-white py-1 px-3 rounded">
          Submit
        </button>
      </span>
    </div>
  </div>
</Modal>
