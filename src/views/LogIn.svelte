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
      window.location.hash = "#/overview";
      window.location.reload();
    } catch (err) {
      alert(err);
    }
	}

</script>

<div class="h-screen w-full flex flex-col justify-center items-center">
  <div class="w-4/5 max-w-md rounded shadow bg-white dark:bg-desk-700 bg-white break-words p-8">
    <form class="w-full h-full">
      <div class="flex justify-center items-center mb-8">
        <img class="object-contain h-12 mr-4" src="/icons/icon-xparent-512.png"/>
        <span class="text-xl">Cardi Notes</span>
      </div>
      <div class="md:flex md:items-center mb-4">
        <div class="md:w-40">
          <label class="block text-primary font-bold md:text-right mb-1 md:mb-0 pr-4" for="accesskey">
            Access Key
          </label>
        </div>
        <div class="md:w-full">
          <input class="border-2 border-gray-200 rounded w-full py-2 px-4 text-grey-700 leading-tight focus:outline-none focus:border-sage-700 dark:focus:border-sage-300" id="accesskey" type="text" placeholder="AKIA...">
        </div>
      </div>
      <div class="md:flex md:items-center mb-8">
        <div class="md:w-40">
          <label class="block text-primary font-bold md:text-right mb-1 md:mb-0 pr-4" for="secretkey">
            Secret Key
          </label>
        </div>
        <div class="md:w-full">
          <input class="border-2 border-gray-200 rounded w-full py-2 px-4 text-grey-700 leading-tight focus:outline-none focus:border-sage-700 dark:focus:border-sage-300" id="secretkey" type="password" placeholder="**********************">
        </div>
      </div>
      <div class="flex items-end justify-end mb-8">
        <button class="shadow bg-sage-700 dark:bg-sage-300 focus:shadow-outline focus:outline-none text-grey-100 font-bold py-2 px-4 rounded" id="submit" type="button" on:click={setup}>
        	<Icon kind="right"/>
        </button>
      </div>
      <div class="flex items-center justify-center flex-col">
        <div class="text-sm">AWS access keys? Read about <a href="https://github.com/pickledish/cardi/wiki/About">how Cardi works</a></div>
      </div>
    </form>
  </div>
</div>
