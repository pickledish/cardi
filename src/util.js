import { get } from 'svelte/store';

import { showSidebar } from './store.js';

export function listToMap(list, indexKey) {
  return new Map(list.map(i => [i[indexKey], i]));
}

export function toggleStore(store) {
  return store.set(!get(store));
}

export function isUrl(string) {
  var urlRegex = new RegExp(
    /^https?:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
  );
  return urlRegex.test(string);
}

export function resetView() {
  // set the sidebar to not be showing anymore
  showSidebar.set(false);
  // and scroll to the top of the page (smooth only on chrome, bah)
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}
