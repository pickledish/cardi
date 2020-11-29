<script>

  import dayjs from 'dayjs';

  import Select from 'svelte-select';

  import { boardList, inProgressBoards } from '../store.js'

  export let items = null;

  $: tags_for_select = $boardList.map(b => ({'label': b.name, 'value': b.created}));

  // hook into the creation so we can make a timestamp here for new boards
  // for more, see docs: https://github.com/rob-balfre/svelte-select
  let customCreateItem = filterText => {
    let now = dayjs().valueOf();
    $inProgressBoards.set(now, filterText);
    $inProgressBoards = $inProgressBoards;
    return {
      'label': filterText,
      'value': now
    };
  };

</script>

<style>

.picker {
  --borderRadius: 4px;
  --selectedItemPadding: 0px 0px 0px 0px;
  --inputFontSize: 100%;
  --itemPadding: 0px 16px 0px 16px;
  --height: 36px;
  --multiItemBorderRadius: 2px;
  --multiItemHeight: 100%;
  --multiClearTop: 0px;
  --multiClearBG: rgba(0,0,0,0);
  --multiClearFill: rgba(64,64,64,255);
  --multiClearHoverBG: rgba(0,0,0,0);
  --multiClearHoverFill: rgba(0,0,0,255);
  --multiItemPadding: 4px 8px;
  --multiSelectPadding: 0 0.5rem 0 0.5rem;
  --placeholderColor: rgba(145,153,166,255);
}

</style>

<div class="picker text-grey-700">
  <Select
    items={tags_for_select}
    isMulti={true}
    isCreatable={true}
    optionIdentifier='label'
    placeholder='Tags'
    createItem={customCreateItem}
    bind:selectedValue={items}
  />
</div>
