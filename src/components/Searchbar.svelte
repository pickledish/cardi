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

<div class="flex items-center rounded bg-desk-100 dark:bg-desk-900 px-4 py-1">
  <input
    class="mr-4 outline-none text-sm bg-desk-100 dark:bg-desk-900 w-28 md:w-auto"
    type="search"
    id="searchbar"
    placeholder="Search notes"
    on:keydown={handleKeyDown}
    >
  <button on:click={handleSearch}>
    <Icon kind="search" size={18}/>
  </button>
</div>
