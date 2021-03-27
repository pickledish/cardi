<script>
  import dayjs from 'dayjs'

  import { currBeforeMs, currAfterMs, currentParams } from '../store.js'

  let selectedYear = null;
  let selectedMonth = null;

  $: {
    if (selectedYear && selectedMonth) {
      let formatted = `${selectedYear}-${selectedMonth}-01`;
      let date = dayjs(formatted);
      // We need to be sure to set currBeforeMs first here, see the jank in store.js!
      $currBeforeMs = dayjs(formatted).add(1, 'month').subtract(1, 'minute').unix() * 1000;
      $currAfterMs = date.unix() * 1000;
    }
  }


</script>

<div class="bg-white">
  <button on:click={() => selectedYear = "2020"}>Set Year 2020</button>
  <button on:click={() => selectedMonth = "05"}>Set Month 05</button>
</div>
