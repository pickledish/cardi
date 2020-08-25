<script>
  import Tailwind from "./Tailwind.svelte";
	import Router from 'svelte-spa-router'
	import Overview from './views/Overview.svelte'
	import MessageView from './views/MessageView.svelte'
	import LogIn from './views/LogIn.svelte'
  import About from './views/About.svelte'

	const routes = {
      //'/': About,
      '/app': Overview,
	    '/message/:message_id': MessageView,
	    '/login': LogIn,
	    // This is optional, but if present it must be the last
	    '*': Overview,
	}
</script>

<style>

</style>

<Tailwind/>
<Router {routes}/>
