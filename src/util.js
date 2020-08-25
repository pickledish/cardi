import { get } from 'svelte/store';

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
