import { writable } from 'svelte/store';

// used to denote an array of objects in the query string
// dash is nicer than comma since it's URL-safe
let ITEMSEPERATOR = "-";

function getQueryParams() {
  // We could use svelte-spa-router's built-in querystring store for this,
  // but it's broken and doesn't update reactively, so we will roll our own
  let hash = window.location.hash;

  if (hash == "") {
    console.error("Why is there no hash? The app doesn't work without a hash");
    return new URLSearchParams();
  }

  if (!hash.includes("?")) {
    // We're on some page without any current query paramters, return empty
    return new URLSearchParams();
  }

  return new URLSearchParams(hash.split("?")[1]);
}

function getQueryParam(paramName, defaultValue) {

  let params = getQueryParams();

  if (params.has(paramName)) {
    let stringValue = params.get(paramName)
    if (['true', 'false'].includes(stringValue)) {
      return stringValue === 'true';
    } else if (!isNaN(parseInt(stringValue))) {
      return parseInt(stringValue);
    } else if (stringValue.includes(ITEMSEPERATOR)) {
      return stringValue.split(ITEMSEPERATOR);
    } else {
      return stringValue;
    }
  } else {
    return defaultValue
  }
}

function setQueryParam(paramName, newValue) {

  let params = getQueryParams();

  if (Array.isArray(newValue)) {
    if (newValue.length == 0) {
      params.delete(paramName);
    } else if (newValue.length == 1) {
      params.set(paramName, newValue + ITEMSEPERATOR);
    } else {
      params.set(paramName, newValue.join(ITEMSEPERATOR));
    }
  } else {
    params.set(paramName, newValue);
  }

  let paramString = params.toString() == "" ? "" : "?" + params.toString();
  window.history.pushState({}, '', "/#/overview" +  paramString);
}

function clearQueryParam(paramName) {

  let params = getQueryParams();

  params.delete(paramName);

  let paramString = params.toString() == "" ? "" : "?" + params.toString();
  window.history.pushState({}, '', "/#/overview" +  paramString);
}

/*
 * Custom state store which is backed by a normal Svelte `writable` store.
 * Ensures that all updates are persisted to query param with name `paramName`
 * so that when you refresh the page, the value is intact.
 */
export function queryStore(paramName, defaultValue) {

  let currentValue = getQueryParam(paramName, defaultValue);
  let innerStore = writable(currentValue);

  return {
    subscribe(newSubscriber) {
      return innerStore.subscribe(newSubscriber);
    },
    set(newValue) {
      if (newValue == defaultValue) {
        clearQueryParam(paramName);
      } else {
        setQueryParam(paramName, newValue);
      }
      return innerStore.set(newValue);
    },
    update(fn) {
      return innerStore.update(fn);
    }
  }
}
