<script>

  export let kind = "missing";
  export let size = 20;
  export let width = 2.5;

</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  class="icon icon-tabler"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  stroke-width="2.5"
  stroke="currentColor"
  fill="none"
  stroke-linecap="round"
  stroke-linejoin="round"
  style="width: {size}px; height: {size}px; stroke-width: {width};"
>
  {#if kind == "missing"}
    <path stroke="none" d="M0 0h24v24H0z"/>
    <path d="M12 9v2m0 4v.01" />
    <path d="M5.07 19H19a2 2 0 0 0 1.75 -2.75L13.75 4a2 2 0 0 0 -3.5 0L3.25 16.25a2 2 0 0 0 1.75 2.75" />
  {:else if kind == "sort"}
    <path stroke="none" d="M0 0h24v24H0z"/>
    <path d="M3 9l4-4l4 4m-4 -4v14" />
    <path d="M21 15l-4 4l-4-4m4 4v-14" />
  {:else if kind == "archive"}
    <path stroke="none" d="M0 0h24v24H0z"/>
    <rect x="3" y="4" width="18" height="4" rx="2" />
    <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10" />
    <line x1="10" y1="12" x2="14" y2="12" />
  {:else if kind == "box"}
    <path stroke="none" d="M0 0h24v24H0z"/>
    <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" />
    <line x1="12" y1="12" x2="20" y2="7.5" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <line x1="12" y1="12" x2="4" y2="7.5" />
  {:else if kind == "calendar"}
    <path stroke="none" d="M0 0h24v24H0z"/>
    <rect x="4" y="5" width="16" height="16" rx="2" />
    <line x1="16" y1="3" x2="16" y2="7" />
    <line x1="8" y1="3" x2="8" y2="7" />
    <line x1="4" y1="11" x2="20" y2="11" />
    <rect x="8" y="15" width="2" height="2" />
  {:else if kind == "history"}
    <path stroke="none" d="M0 0h24v24H0z"/>
    <polyline points="12 8 12 12 14 14" />
    <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
  {:else if kind == "home"}
    <path stroke="none" d="M0 0h24v24H0z"/>
    <polyline points="5 12 3 12 12 3 21 12 19 12" />
    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
    <rect x="10" y="12" width="4" height="4" />
  {:else if kind == "sad"}
    <path stroke="none" d="M0 0h24v24H0z"/>
    <circle cx="12" cy="12" r="9" />
    <line x1="9" y1="10" x2="9.01" y2="10" />
    <line x1="15" y1="10" x2="15.01" y2="10" />
    <path d="M9.5 15.25a3.5 3.5 0 0 1 5 0" />
  {:else if kind == "search"}
    <path stroke="none" d="M0 0h24v24H0z"/>
    <circle cx="10" cy="10" r="7" />
    <line x1="21" y1="21" x2="15" y2="15" />
  {:else if kind == "check"}
    <path stroke="none" d="M0 0h24v24H0z"/>
    <path d="M5 12l5 5l10 -10" />
  {:else if kind == "plus"}
    <path stroke="none" d="M0 0h24v24H0z"/>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  {:else if kind == "right"}
    <path stroke="none" d="M0 0h24v24H0z"/>
    <polyline points="7 7 12 12 7 17" />
    <polyline points="13 7 18 12 13 17" />
  {:else if kind == "trash"}
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
  {:else if kind == "square-plus"}
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="12" y1="9" x2="12" y2="15" />
  {:else if kind == "square-minus"}
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <line x1="9" y1="12" x2="15" y2="12" />
  {:else if kind == "spinny"}
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <line x1="12" y1="6" x2="12" y2="3" />
    <line x1="16.25" y1="7.75" x2="18.4" y2="5.6" />
    <line x1="18" y1="12" x2="21" y2="12" />
    <line x1="16.25" y1="16.25" x2="18.4" y2="18.4" />
    <line x1="12" y1="18" x2="12" y2="21" />
    <line x1="7.75" y1="16.25" x2="5.6" y2="18.4" />
    <line x1="6" y1="12" x2="3" y2="12" />
    <line x1="7.75" y1="7.75" x2="5.6" y2="5.6" />
  {:else if kind == "circle"}
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <circle cx="12" cy="12" r="9" />
  {:else}
    {console.log(`Unknown icon: ${kind}`)}
  {/if}
</svg>
