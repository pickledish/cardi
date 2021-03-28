<script>
  import dayjs from 'dayjs'

  import { currBeforeMs, currAfterMs, currentParams } from '../store.js'
  import { resetView } from '../util/storeutil.js'

  let years = {
    "2019": "2019",
    "2020": "2020",
    "2021": "2021",
  };

  let months = {
    "Jan": "01",
    "Feb": "02",
    "Mar": "03",
    "Apr": "04",
    "May": "05",
    "Jun": "06",
    "Jul": "07",
    "Aug": "08",
    "Sep": "09",
    "Oct": "10",
    "Nov": "11",
    "Dec": "12",
  };

  let selectedYear = null;
  let selectedMonth = null;

  function setParams() {
    let formatted = `${selectedYear}-${selectedMonth}-01`;
    // We need to be sure to set currBeforeMs first here, see the jank in store.js!
    $currBeforeMs = dayjs(formatted).add(1, 'month').subtract(1, 'minute').unix() * 1000;
    $currAfterMs = dayjs(formatted).unix() * 1000;
    resetView();
  }

  $: {
    if (selectedYear && selectedMonth) {
      setParams();
    }
  }


</script>

<div class="rounded shadow bg-white dark:bg-desk-700">
  <div class="flex flex-row px-4 py-2">
    <div class="flex flex-col justify-center pr-3 border-r-2 border-sage-700 dark:border-sage-300">
      {#each Object.entries(years) as [name, value]}
        <div
          class="rounded cursor-pointer hover:bg-desk-300 dark:hover:bg-desk-700 {selectedYear == value ? "font-bold" : ""}"
          on:click={() => selectedYear = value}
        >
          {name}
        </div>
      {/each}
    </div>
    <div class="flex flex-col justify-center pl-3">
      {#each Object.entries(months) as [name, value]}
        <div
          class="rounded cursor-pointer hover:bg-desk-300 dark:hover:bg-desk-700 {selectedMonth == value ? "font-bold" : ""}"
          on:click={() => selectedMonth = value}
        >
          {name}
        </div>
      {/each}
    </div>
  </div>
</div>
