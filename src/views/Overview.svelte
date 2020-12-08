<script>

  import Cookie from 'js-cookie'

  import { onMount } from 'svelte';
  import LogIn from './LogIn.svelte'

  import Navbar from '../components/Navbar.svelte'
  import MessageGrid from '../components/MessageGrid.svelte';
  import Sidebar from '../components/Sidebar.svelte'
  import Footer from '../components/Footer.svelte'

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
<div class="container mx-auto h-auto">
  {#if creds}
  <div class="flex">
    <Sidebar/>
    <MessageGrid/>
  </div>
  {:else}
  <LogIn/>
  {/if}
</div>
<Footer/>
