
<script>

  import Searchbar from './Searchbar.svelte'
  import NewSnippetModal from './NewSnippetModal.svelte'

</script>

<NewSnippetModal/>

<header class="flex justify-between items-center z-10 w-full h-12 px-4 w-auto bg-peach shadow">
  <section>
    <a href="www.google.com" class="navbar-brand mr-2 text-red-500">THE GREAT FUNNEL</a>
    <span class="hidden md:inline">
      <a href="#/login">Login</a>
      <a href="#/">Overview</a>
      <a href="...">Account</a>
    </span>
  </section>
  <section>
    <Searchbar/>
  </section>
</header>
