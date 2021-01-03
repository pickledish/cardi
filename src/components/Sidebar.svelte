<script>
	import dayjs from 'dayjs'
  import Cookie from 'js-cookie'

  import Checkbox from './Checkbox.svelte'
  import SidebarItem from './SidebarItem.svelte'
  import Icon from './Icon.svelte'

  import { documentClient } from '../dynamodb/client.js'
  import { getBoards } from '../dynamodb/board.js'
  import { currArchived, currAscending, currAfterMs, currBoard, boardList, sortedBoardList, showSidebar } from '../store.js'

  import { onMount } from 'svelte';

  import { resetView, toggleStore } from '../util.js';

  // When we load the sidebar, async get all boards, then update the tag store
  onMount(async () => {
    let accessKey = Cookie.get('awsAccessKey');
    let secretKey = Cookie.get('awsSecretKey');
    let client = documentClient(accessKey, secretKey);
    $boardList = await getBoards(client);
  });

  // Support filtering so people don't have to look at them all at once
  let prefix = "";
	$: shownBoards = $sortedBoardList.filter(b => b.name.startsWith(prefix));

</script>

<style>
  aside {
    transition: left 0.3s ease-in-out;
  }
  .open {
    left: 0;
  }
</style>

<aside class="w-full md:w-1/5 min-w-14rem absolute -left-full md:left-0 md:relative z-10 bg-desk-100 dark:bg-desk-900 {$showSidebar ? "open" : ""} pt-4 px-4">

  <div class="p-2 text-xs text-light my-1 tracking-widest">
  	<p>QUICK VIEWS</p>
  </div>

  <SidebarItem
    icon="home"
    text="Overview"
    selected={$currBoard == "" && $currAfterMs == 0}
    action={() => (window.location = "/") && resetView()}
  />

  <SidebarItem
    icon="sad"
    text="Untagged"
    selected={$currBoard == "none"}
    action={() => ($currBoard = "none") && resetView()}
  />

  <SidebarItem
    icon="calendar"
    text="This Month"
    selected={$currAfterMs == dayjs().startOf('month').unix() * 1000}
    action={() => ($currAfterMs = dayjs().startOf('month').unix() * 1000) && resetView()}
  />

  <SidebarItem
    icon="history"
    text="From Today"
    selected={$currAfterMs == dayjs().startOf('day').unix() * 1000}
    action={() => ($currAfterMs = dayjs().startOf('day').unix() * 1000) && resetView()}
  />

  <SidebarItem
    icon="archive"
    text="Archived"
    selected={$currArchived}
    action={() => toggleStore(currArchived) && resetView()}
  >
    <Checkbox bind:checked={$currArchived} on:click/>
  </SidebarItem>

  <SidebarItem
    icon="sort"
    text="Ascending"
    selected={$currAscending}
    action={() => toggleStore(currAscending) && resetView()}
  >
    <Checkbox bind:checked={$currAscending} on:click/>
  </SidebarItem>

  <div class="p-2 text-xs text-light my-1 tracking-widest">
  	<p>ALL BOARDS</p>
  </div>

  <div class="flex items-center p-2 ml-4 text-md rounded cursor-pointer hover:bg-desk-300 dark:hover:bg-desk-700">
  	<Icon kind="search"/>
  	<input class="px-2 w-32 rounded outline-none" style="background-color: inherit;" bind:value={prefix}>
  </div>

  {#each shownBoards as board}
  <SidebarItem
    icon="box"
    text="{board.name}"
    selected={$currBoard == board.created}
    action={() => ($currBoard = board.created) && resetView()}
  >
    <span>{$currArchived ? board.archived : board.current}</span>
  </SidebarItem>
  {/each}

</aside>
