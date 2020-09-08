import Cookie from 'js-cookie'

import { writable, derived } from 'svelte/store';

import { queryStore } from './querystore.js'
import { listToMap } from './util.js';
import { documentClient } from './dynamodb/client.js'
import { getSnippets } from './dynamodb/note.js'
import { toSearchKeys } from './search.js'

// ----------------------------------------------------------------------------
// Parameters, stored in the querystring and updated via the UI
// ----------------------------------------------------------------------------

export const currArchived  = queryStore("arch", false);
export const currAfterMs   = queryStore("after", 0);
export const currBoard     = queryStore("board", "");
export const currSearch    = queryStore("search", "");
export const currAscending = queryStore("asc", false);
export const currPageSize  = queryStore("page", 25);

// ----------------------------------------------------------------------------
// The parameter struct, updated reactively based on any individual store
// ----------------------------------------------------------------------------

export const currentParams = derived(
  [
    currArchived,
    currAfterMs,
    currBoard,
    currSearch,
    currAscending,
    currPageSize,
  ],
  params => {
    let struct = {
      "status": params[0] ? "archived" : "current",
      "afterMs": params[1],
      "board": params[2],
      "search": toSearchKeys(params[3]),
      "ascending": params[4],
      "pageSize": params[5],
    }
    console.log(`Update, triggering refresh: ${JSON.stringify(struct)}`);
    return struct;
  }
);

// ----------------------------------------------------------------------------
// The data from dynamodb, updated reactively based on the parameter struct
// ----------------------------------------------------------------------------

export const noteList = derived(
  currentParams,
  async (params, set) => {
    let accessKey = Cookie.get('awsAccessKey');
    let secretKey = Cookie.get('awsSecretKey');
    let client = documentClient(accessKey, secretKey);
    let response = await getSnippets(client, params);
    set(response);
  },
  []
);

export const noteMap = derived(
  noteList,
  list => listToMap(list, "created")
);

// ----------------------------------------------------------------------------
// These last two aren't cool like the notes ones, sorry :P
// ----------------------------------------------------------------------------

export const boardList = writable([]);

export const sortedBoardList = derived(
  boardList,
  l => l.slice().sort((first, second) => first.name > second.name)
);

export const boardMap = derived(
  boardList,
  l => listToMap(l, "created")
);

// ----------------------------------------------------------------------------
// Utility stores, not really global, could probably go somewhere else
// ----------------------------------------------------------------------------

export const tiles_checked = writable(new Set());
export const show_new_snippet_modal = writable(false);
export const shownNote = writable(null);
