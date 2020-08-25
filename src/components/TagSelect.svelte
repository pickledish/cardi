<script>

  import Select from 'svelte-select';

  import { boardList } from '../store.js'

  export let items = null;

  $: tags_for_select = $boardList.map(b => ({'label': b.name, 'value': b.created}));

</script>

<style>

.picker {
  --borderRadius: 0px;
  --selectedItemPadding: 0px 0px 0px 0px;
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
  --multiItemMargin: 0 4px;
}

</style>

<div class="picker">
  <Select
    items={tags_for_select}
    isMulti={true}
    isCreatable={true}
    optionIdentifier='label'
    placeholder='Tags'
    bind:selectedValue={items}
  />
</div>
