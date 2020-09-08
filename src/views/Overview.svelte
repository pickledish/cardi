<script>

  import Cookie from 'js-cookie'

  import { onMount } from 'svelte';
  import LogIn from './LogIn.svelte'

  import Navbar from '../components/Navbar.svelte'
  import MessageGrid from '../components/MessageGrid.svelte';
  import Sidebar from '../components/Sidebar.svelte'

  let creds = false;

  // Before we load anything, make sure
  onMount(() => {
    if (Cookie.get('awsAccessKey') && Cookie.get('awsSecretKey')) {
      creds = true;
    } else {
      console.log("No creds found, sending to cred input page...");
    }
  });

</script>

{#if creds}
<Navbar/>
{/if}
<div class="container mx-auto h-full">
  {#if creds}
  <div class="flex mx-2">
    <div class="w-1/5 min-w-14rem hidden md:block">
      <div class="pt-4 pr-6"><Sidebar/></div>
    </div>
    <div class="w-full md:w-4/5">
      <div class="p-2"><MessageGrid/></div>
    </div>
  </div>
  {:else}
  <LogIn/>
  {/if}
</div>
