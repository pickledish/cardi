<script>

  import { onMount } from 'svelte';

  import Icon from './Icon.svelte'

  import { currSearch } from '../store.js'

  onMount(async () => {
    document.querySelector('#searchbar').value = $currSearch;
  });

  function handleSearch() {
    let search_str = document.querySelector('#searchbar').value;
    $currSearch = search_str;
  }

  function handleKeyDown(event) {
    if (event.keyCode == 13) {
      handleSearch();
    }
  }

</script>

<div class="flex items-center rounded bg-peach-dark px-4 py-1">
  <input
    class="mr-4 outline-none text-sm bg-peach-dark placeholder-gray-200"
    type="search"
    id="searchbar"
    placeholder="Search snippets"
    on:keydown={handleKeyDown}
    >
  <button on:click={handleSearch}>
    <Icon kind="search" size={20}/>
  </button>
</div>
