<script>

  import Searchbar from './Searchbar.svelte'
  import NewSnippetModal from './NewSnippetModal.svelte'

  import { showSidebar } from '../store.js';
  import { toggleStore } from '../util.js';

</script>

<NewSnippetModal/>

<header class="relative flex justify-between items-center z-20 w-full h-12 px-4 w-auto bg-peach shadow dark:text-grey-700">
  <section class="flex justify-start items-center">
    <img class="object-contain h-10 mr-2" src="/icons/icon-xparent-512.png" on:click="{() => toggleStore(showSidebar)}"/>
    <span class="cursor-pointer hover:underline" on:click="{() => window.location = '/'}">Cardi <span class="hidden md:inline">Notes</span></span>
    <div class="hidden md:inline">
      <span>
        &nbsp;&nbsp;·&nbsp;
        <span class="cursor-pointer hover:underline" on:click="{() => window.location = '/'}">Overview</span>
      </span>
      <span>
        &nbsp;·&nbsp;
        <a class="visited:text-primary" href="https://github.com/pickledish/cardi/wiki/About">About</a>
      </span>
      <span>
        &nbsp;·&nbsp;
        <a class="visited:text-primary" href="https://github.com/pickledish/cardi/">Source</a>
      </span>
    </div>
  </section>
  <section>
    <Searchbar/>
  </section>
</header>
