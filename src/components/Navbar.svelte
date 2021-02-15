<script>

  import Searchbar from './Searchbar.svelte'
  import NewSnippetModal from './NewSnippetModal.svelte'

  import { showSidebar } from '../store.js';
  import { toggleStore } from '../util.js';

</script>

<NewSnippetModal/>

<div class="sticky top-0 z-20">
  <div class="w-full h-1.5 bg-sage-700 dark:bg-sage-300"></div>
  <header class="flex justify-between items-center w-full h-11 px-4 w-auto bg-white dark:bg-desk-700 shadow-md">
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
          <a class="visited:text-primary" href="https://github.com/pickledish/cardi/">Source</a>
        </span>
        <span>
          &nbsp;·&nbsp;
          <a class="visited:text-primary" href="https://github.com/pickledish/cardi/issues/new">Feedback</a>
        </span>
      </div>
    </section>
    <section>
      <Searchbar/>
    </section>
  </header>
</div>

