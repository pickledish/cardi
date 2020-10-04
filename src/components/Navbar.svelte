<script>

  import Searchbar from './Searchbar.svelte'
  import NewSnippetModal from './NewSnippetModal.svelte'

</script>

<NewSnippetModal/>

<header class="flex justify-between items-center z-10 w-full h-12 px-4 w-auto bg-peach shadow">
  <section class="flex justify-start items-center">
    <img class="object-contain h-10 mr-2" src="/icons/icon-xparent-512.png"/>
    <span class="cursor-pointer hover:underline" on:click="{() => window.location = '/'}">Cardi <span class="hidden md:inline">Notes</span></span>
    <div class="hidden md:inline">
      <span>
        &nbsp;&nbsp;·&nbsp;
        <span class="cursor-pointer hover:underline" on:click="{() => window.location = '/'}">Overview</span>
      </span>
      <span>
        &nbsp;·&nbsp;
        <a class="text-primary visited:text-primary" href="https://github.com/pickledish/cardi/wiki/About">About</a>
      </span>
      <span>
        &nbsp;·&nbsp;
        <a class="text-primary visited:text-primary" href="https://github.com/pickledish/cardi/">Source</a>
      </span>
    </div>
  </section>
  <section>
    <Searchbar/>
  </section>
</header>
