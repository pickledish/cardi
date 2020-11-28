<script>
	import Router from 'svelte-spa-router'
	import Overview from './views/Overview.svelte'
	import LogIn from './views/LogIn.svelte'

	const routes = {
      //'/': About,
      '/overview': Overview,
	    '/login': LogIn,
	    // This is optional, but if present it must be the last
	    '*': Overview,
	}
</script>

<style>

</style>

<Router {routes}/>
