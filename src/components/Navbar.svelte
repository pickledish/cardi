
<script>

  import Searchbar from './Searchbar.svelte'
  import NewSnippetModal from './NewSnippetModal.svelte'

</script>

<NewSnippetModal/>

<header class="flex justify-between items-center z-10 w-full h-12 px-4 w-auto bg-peach shadow">
  <section>
    <span class="text-red-500">CARDI NOTES &nbsp;·&nbsp;</span>
    <span class="hidden md:inline">
      <a href="#/app/">Overview &nbsp;·&nbsp;</a>
      <a href="https://github.com/pickledish/cardi/wiki/About">About &nbsp;·&nbsp;</a>
      <a href="https://github.com/pickledish/cardi/wiki/Setup">Setup</a>
    </span>
  </section>
  <section>
    <Searchbar/>
  </section>
</header>
