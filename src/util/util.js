import { get } from 'svelte/store';

export function listToMap(list, indexKey) {
  return new Map(list.map(i => [i[indexKey], i]));
}

export function toggleStore(store) {
  return store.set(!get(store));
}

export function isUrl(string) {
  var urlRegex = new RegExp(/^https?:\/\/([a-zA-Z-]+)(\.[a-zA-Z-]+)+(:[0-9]+)?(\S+)?$/);
  return urlRegex.test(string);
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
