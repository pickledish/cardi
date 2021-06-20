<script>

  import { onMount } from 'svelte';
  import { sleep } from '../util/util.js'

  export let timeoutMs = 5000;
  export let timedOut = false;

  onMount(async () => {
    await sleep(timeoutMs);
    timedOut = true;
  });

</script>

<style>

  @keyframes spinner {
    to {transform: rotate(360deg);}
  }

  .spinner:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    margin-top: -20px;
    margin-left: -20px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: #aabeaa;
    border-bottom-color: #aabeaa;
    animation: spinner 1.25s linear infinite;
  }

</style>

{#if timedOut}
Unable to get messages! Is your internet working?
{:else}
<div class="spinner"></div>
{/if}
