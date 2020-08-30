import dayjs from 'dayjs'

import { incrementBoard, decrementBoard } from './board.js'

// ----------------------------------------------------------------------------
// Secret inner workings
// ----------------------------------------------------------------------------

// trick here is going to be exponential scan forward, like binary search
// first query, do limit = 100 maybe (~2x requested page size?),
// see if we've reached page_size param
// if so, stop! You did it
// if not, make next query with limit = 1000, check again
// if not, then try with limit = 10000, etc
// this way we don't inhale crazy bandwidth when we don't need to
// (i.e. when the filter is weak & almost all snippets match)
// but also guarantee that for strong filerts (almost no snippets match)
// we'll need to do no more than ~3 API calls :)

// ~30ms per call means we'll be below 100ms always, which is good
// optimization todo, for search box searches, always use biggest limit

async function exponentialSearch(client, params, desiredPage) {
  console.log(`Starting exponential search with params ${JSON.stringify(params)}...`)
  return exponentialSearchInternal(client, params, desiredPage, desiredPage * 2, null);
}

async function exponentialSearchInternal(client, params, remaining, limit, lastKey) {

  // keep this log line here until we're sure it works right
  console.log(`Internal exponential search called with limit ${limit}`)
  params['Limit'] = limit;

  if (lastKey) {
    params['ExclusiveStartKey'] = lastKey;
  }

  let data = await client.query(params).promise();

  if (data['Count'] < remaining && data.hasOwnProperty('LastEvaluatedKey')) {
    let newData = await exponentialSearchInternal(
      client,
      params,
      remaining - data['Count'],
      limit * 4,
      data['LastEvaluatedKey']
    )
    return data['Items'].concat(newData)
  } else {
    return data['Items']
  }
}

// Input struct looks like this:
// {
//   "status": "archived",
//   "afterMs": 123,
//   "board": 456,
//   "search": ["filipino"],
//   "ascending": true,
//   "pageSize": 20,
// }
// We need to turn it into something dynamo will accept

function inputToDynamo(paramStruct) {
  let key_filters = [
    `#status = :status`,
    `#created > :afterMs`,
  ];
  let other_filters = [];
  let expressionAttributeNames = {
    "#status": "status",
    "#created": "created",
  }
  let expressionAttributeValues = {
    ":status": paramStruct["status"],
    ":afterMs": paramStruct["afterMs"],
  }
  if (paramStruct["board"]) {
    other_filters.push('contains (#boards, :board)');
    expressionAttributeNames["#boards"] = "boards";
    expressionAttributeValues[":board"] = paramStruct["board"];
  }
  if (paramStruct["search"].length > 0) {
    expressionAttributeNames["#search"] = "search";
    paramStruct["search"].forEach(key => {
      other_filters.push(`contains (#search, :${key})`);
      expressionAttributeValues[`:${key}`] = key;
    });
  }
  return {
    'TableName': 'cardi-notes',
    'KeyConditionExpression': key_filters.join(' and '),
    'FilterExpression': other_filters.join(' and ') || null,
    'ExpressionAttributeNames': expressionAttributeNames,
    'ExpressionAttributeValues': expressionAttributeValues,
    'ScanIndexForward': paramStruct["ascending"],
  };
}

// ----------------------------------------------------------------------------
// Public API
// ----------------------------------------------------------------------------

export async function getSnippets(client, paramStruct) {

  let dynamoParams = inputToDynamo(paramStruct);

  try {
    let data = await exponentialSearch(
      client,
      dynamoParams,
      paramStruct["pageSize"]
    );
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getSnippet(client, status, created) {

  let params = {
    'TableName': 'cardi-notes',
    'Key': {
      'status': status,
      'created': created,
    },
  };
  try {
    let data = await client.get(params).promise();
    return data['Item'];
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function createSnippet(client, status, created, title, content, boards, search) {

  let epoch = dayjs().valueOf();

  if (!created) {
    created = epoch;
  }

  var params = {
    'TableName': 'cardi-notes',
    'Item': {
      "status"   : status,
      "created"  : created,
      "updated"  : epoch,
      "title"    : title,
      "content"  : content,
      "boards"   : boards,
      "search"   : search,
      "kind"     : "note",
    }
  }

  try {
    let noteResult = await client.put(params).promise();
    let boardResults = await Promise.all(boards.map(async (board) => {
      return incrementBoard(client, board, status);
    }));
    return noteResult;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteSnippet(client, status, created, boards) {
  // boards isn't necessary to delete the snippet,
  // but we do want to reconcile the board counts now too
  let params = {
    'TableName': 'cardi-notes',
    'Key': {
      'status': status,
      'created': created,
    },
  };
  try {
    let noteResult = await client.delete(params).promise();
    let boardResults = await Promise.all(boards.map(async (board) => {
      return decrementBoard(client, board, status);
    }));
    return true;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function changeStatus(client, oldStatus, created, newStatus) {
  try {
    let oldSnippet = await getSnippet(client, oldStatus, created);
    let ok = await createSnippet(
      client,
      newStatus,
      oldSnippet.created,
      oldSnippet.title,
      oldSnippet.content,
      oldSnippet.boards,
      oldSnippet.search,
    );
    return await deleteSnippet(client, oldStatus, created, oldSnippet.boards);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function changeBoards(client, status, created, boardIds, action) {
  // action must be either ADD or REMOVE
  let params = {
    'TableName': 'cardi-notes',
    'Key': {
      'status': status,
      'created': created,
    },
    'AttributeUpdates': {
      'boards': {
        'Action': action,
        'Value': boardIds,
      }
    },
  }
  try {
    let data = await client.update(params).promise();
    return data['Item'];
  } catch (err) {
    console.log(err);
    return err;
  }
}
