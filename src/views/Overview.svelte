<script>

  import { getClient } from '../client/client.js'

  import Cookie from 'js-cookie'

  import LogIn from './LogIn.svelte'

  import Navbar from '../components/Navbar.svelte'
  import MessageGrid from '../components/MessageGrid.svelte';
  import Sidebar from '../components/Sidebar.svelte'
  import Footer from '../components/Footer.svelte'

  let creds = false;

  if (Cookie.get('awsAccessKey') && Cookie.get('awsSecretKey')) {
    let client = getClient("dynamodb", {
      "accessKey": Cookie.get('awsAccessKey'),
      "secretKey": Cookie.get('awsSecretKey')
    });
    window.client = client;
    creds = true;
  } else {
    console.log("No creds found, sending to cred input page...");
  }

</script>

{#if creds}
<Navbar/>
{/if}
<div class="container mx-auto h-auto xl:px-12">
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
