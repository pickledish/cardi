<script>

	import Cookie from 'js-cookie'

  import Icon from '../components/Icon.svelte'

  import { lowLevelClient } from '../dynamodb/client.js'
  import { ensureTables } from '../dynamodb/table.js'

	async function setup() {

    let accessKey = document.querySelector("#accesskey").value;
    let secretKey = document.querySelector("#secretkey").value;

    console.log(`Checking credentials and ensuring tables exist...`)

    try {
      let client = lowLevelClient(accessKey, secretKey);
      let response = await ensureTables(client);
      Cookie.set("awsAccessKey", accessKey);
      Cookie.set("awsSecretKey", secretKey);
      window.location.hash = "#/app";
      window.location.reload();
    } catch (err) {
      alert(err);
    }
	}

</script>

<div class="h-full w-full flex flex-col justify-center items-center">
	<div class="text-3xl mb-6">~ existing snipper ~</div>
  <div class="w-4/5 md:w-2/5 max-w-sm rounded shadow border border-gray-100 bg-white break-words p-8">
    <form class="w-full h-full">
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="accesskey">
            Access Key
          </label>
        </div>
        <div class="md:w-2/3">
          <input class="border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-red-700" id="accesskey" type="text" placeholder="AKIA...">
        </div>
      </div>
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="secretkey">
            Secret Key
          </label>
        </div>
        <div class="md:w-2/3">
          <input class="border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-red-700" id="secretkey" type="password" placeholder="******************">
        </div>
      </div>
      <div class="flex items-end justify-end mb-8">
        <button class="shadow bg-red-700 hover:bg-red-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button" on:click={setup}>
        	<Icon kind="right"/>
        </button>
      </div>
      <div class="flex items-center justify-center">
      	<div class="text-xs">Don't have an account? <a href="/#/signup">Make one here</a></div>
      </div>
    </form>
  </div>
</div>
