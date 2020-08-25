<script>

  import Navbar from '../components/Navbar.svelte'
  import Sidebar from '../components/Sidebar.svelte'
  import SingleMessage from '../components/SingleMessage.svelte'

  export let params;

</script>

<Navbar/>

<div class="container mx-auto">
  <div class="flex mx-2">
    <div class="w-1/5 hidden md:block">
      <div class="pt-4 pr-6"><Sidebar/></div>
    </div>
    <div class="w-full md:w-4/5">
      <div class="p-2"><SingleMessage params="{params}"/></div>
    </div>
  </div>
</div>
