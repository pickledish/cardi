import Cookie from 'js-cookie'

import { writable, derived, get } from 'svelte/store'

import * as constants from './constants.js'
import { queryStore } from './util/querystore.js'
import { listToMap } from './util/util.js'
import { documentClient } from './dynamodb/client.js'
import { getSnippets } from './dynamodb/note.js'
import { toSearchKeys } from './util/search.js'

// ----------------------------------------------------------------------------
// Parameters, stored in the querystring and updated via the UI
// ----------------------------------------------------------------------------

export const currArchived  = queryStore("arch", constants.defaultArchived);
export const currAfterMs   = queryStore("after", constants.defaultAfterMs);
export const currBeforeMs  = queryStore("before", constants.defaultBeforeMs);
export const currBoard     = queryStore("board", constants.defaultBoard);
export const currSearch    = queryStore("search", constants.defaultSearch);
export const currAscending = queryStore("asc", constants.defaultAscending);
export const currPageSize  = queryStore("page", constants.defaultPageSize);

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
    // Note, this is pretty jank --
    // we only reactively update if currAfterMs updates, and not currBeforeMs,
    // because Svelte doesn't let us atomically update 2 stores at once,
    // and if we try to derive from and update both, we get a race condition;
    // so when you're setting both, you need to set currBeforeMs first!
    let struct = {
      "status": params[0] ? "archived" : "current",
      "afterMs": params[1],
      "beforeMs": get(currBeforeMs),
      "board": params[2],
      "search": toSearchKeys(params[3]),
      "ascending": params[4],
      "pageSize": params[5],
    }
    return struct;
  }
);

// ----------------------------------------------------------------------------
// The data from dynamodb, updated reactively based on the parameter struct
// ----------------------------------------------------------------------------

export const noteList = derived(
  currentParams,
  async (params, set) => {
    console.log(`Update, triggering refresh: ${JSON.stringify(params)}`);
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
  l => l.slice().sort((first, second) => first.name > second.name ? 1 : -1)
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

// map from timestamp -> name of new board we're about to create
// necessary so we can remember the names of board IDs not persisted yet
export const inProgressBoards = writable(new Map());

// are we currently showing the sidebar? Used when mobile
export const showSidebar = writable(false);
