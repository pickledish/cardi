<script>

  import dayjs from 'dayjs'
  import Cookie from 'js-cookie'
  import marked from 'marked'

  import { isUrl } from '../util/util.js'
  import { toSearchKeys } from '../util/search.js'
  import { noteMap, boardMap, currBoard } from '../store.js'

  import { documentClient } from '../dynamodb/client.js'
  import { updateSnippet } from '../dynamodb/note.js'

  export let created;

  $: fullNote = $noteMap.get(created);

  $: rows = fullNote && fullNote.content.split("\n").length;
  $: created_date = fullNote && dayjs(fullNote.created).format('MMM D, YYYY');
  $: updated_date = fullNote && dayjs(fullNote.updated).format('MMM D, YYYY');

  let editing = false;

  async function submit() {
    let editedTitle = document.getElementById('title').value;
    let editedContent = document.getElementById('content').value;
    try {
      // If the content is a URL, don't turn that into search keys
      let searchable = isUrl(editedContent) ? editedTitle : editedTitle  + " " + editedContent;
      let searchKeys = toSearchKeys(searchable);

      let accessKey = Cookie.get('awsAccessKey');
      let secretKey = Cookie.get('awsSecretKey');
      let client = documentClient(accessKey, secretKey);

      let fixedTitle = editedTitle.length == 0 ? null : editedTitle;

      let response = await updateSnippet(client, fullNote.created, fixedTitle, editedContent, searchKeys);

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  // ~ Hacking ~ the markdown renderer to open links in new tabs with "target=_blank"
  const renderer = {
    link(href, title, text) {
        let out = '<a href="' + href + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += ' target="_blank"'
        out += ' rel="noopener noreferrer"'
        out += '>' + text + '</a>';
        return out;
    }
  }

  marked.use({ renderer });

</script>

<div>
  {#if editing}
  <input id="title" class="w-full mb-1 p-2 rounded bg-desk-100 dark:bg-desk-900" value={fullNote.title || ""}/>
  {:else}
  <span class="text-2xl">
    {fullNote.title || "(no title)"}
  </span>
  {/if}
  <div class="flex items-center justify-between">
    <div class="text-light">
      {created_date} » {updated_date}
    </div>
    <span class="cursor-pointer" on:click="{() => editing = !editing}">
      [edit]
    </span>
  </div>
  {#if editing}
  <textarea id="content" class="w-full h-auto p-2 my-3 rounded bg-desk-100 dark:bg-desk-900" rows="{rows || 1}" value={fullNote.content}/>
  {:else}
  <div class="py-6 break-words">
    {@html marked(fullNote.content)}
  </div>
  {/if}
  {#if fullNote.boards && fullNote.boards.length !== 0}
  <div class="flex items-center justify-between">
    <div>
      {#each Array.from(fullNote.boards.values) as id}
      <span
        class="inline-block rounded bg-gray-200 px-2 py-1 text-sm text-grey-700 mr-2 cursor-pointer"
        on:click={() => $currBoard = id}
      >
        {$boardMap.get(id) && $boardMap.get(id).name}
      </span>
      {/each}
    </div>
    <div>
      {#if editing}
        <button
          id="submit"
          on:click="{submit}"
          class="inline-block rounded bg-sage-300 dark:bg-sage-700 px-2 py-1 text-sm">
          Update
        </button>
      {/if}
    </div>
  </div>
  {/if}
</div>
