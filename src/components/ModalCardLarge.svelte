<script>

  import Modal from './Modal.svelte'
  import CardLarge from './CardLarge.svelte'

  import { shownNote } from '../store.js'

  $: show = ($shownNote != null);

</script>

<Modal show={show} onClose={() => $shownNote = null}>
  <CardLarge created={$shownNote}/>
</Modal>
