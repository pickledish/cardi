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

// ----------------------------------------------------------------------------
// Helpers to get the DynamoDB operation param struct as JSON
// ----------------------------------------------------------------------------

function getOneOperation(status, created) {
  return {
    'TableName': 'cardi-notes',
    'Key': {
      'status': status,
      'created': created,
    }
  }
}

function getManyOperation(status, afterMs, board, search, ascending) {
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
    ":status": status,
    ":afterMs": afterMs,
  }
  if (board) {
    other_filters.push('contains (#boards, :board)');
    expressionAttributeNames["#boards"] = "boards";
    expressionAttributeValues[":board"] = board;
  }
  if (search.length > 0) {
    expressionAttributeNames["#search"] = "search";
    search.forEach(key => {
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
    'ScanIndexForward': ascending,
  }
}

function createOperation(client, status, created, title, content, boards, search) {

  let epoch = dayjs().valueOf();

  if (!boards || boards.length == 0) {
    boards = [0];
  }

  if (!search || search.length == 0) {
    search = [""];
  }

  return {
    'TableName': 'cardi-notes',
    'Item': {
      "status"   : status,
      "created"  : created ? created : epoch,
      "updated"  : epoch,
      "title"    : title,
      "content"  : content,
      "boards"   : client.createSet(boards),
      "search"   : client.createSet(search),
      "kind"     : "note",
    }
  }
}

function deleteOperation(status, created) {
  return {
    'TableName': 'cardi-notes',
    'Key': {
      'status': status,
      'created': created,
    }
  }
}

function updateBoardOperation(status, created, action, boards) {
  return {
    'TableName': 'cardi-notes',
    'Key': {
      'status': status,
      'created': created,
    },
    'AttributeUpdates': {
      'boards': {
        'Action': action,
        'Value': boards,
      }
    }
  }
}

// ----------------------------------------------------------------------------
// Public API
// ----------------------------------------------------------------------------

export async function getSnippets(client, struct) {

  let operation = getManyOperation(
    struct.status,
    struct.after,
    struct.board,
    struct.search,
    struct.ascending
  );

  try {
    let data = await exponentialSearch(client, operation, paramStruct["pageSize"]);
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getSnippet(client, status, created) {

  let operation = getOneOperation(status, created);

  try {
    let data = await client.get(operation).promise();
    return data['Item'];
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function createSnippet(client, status, created, title, content, boards, search) {

  // One operation to create the new snippet in the cardi-notes table
  let createOperation = [{
    "Put": createOperation(client, status, created, title, content, boards, search)
  }];

  // One operation PER BOARD to the cardi-boards table to update counts
  let boardOperations = boards.map(board => {
    "Update": incrementOperation(client, board, status)
  });

  // Combine all operations into a single transaction for DynamoDB
  let transactionParams = {
    "TransactItems": createOperation.concat(boardOperations)
  };

  try {
    let result = await client.transactWrite(transactionParams).promise();
    return true;
  } catch (err) {
    console.log(`Unable to create new snippet due to error from AWS: ${err}`);
    throw err;
  }
}

export async function deleteSnippet(client, status, created, boards) {

  // One operation to delete the old snippet in the cardi-notes table
  let deleteOperation = [{
    "Delete": deleteOperation(client, status)
  }];

  // One operation PER BOARD to the cardi-boards table to update counts
  let boardOperations = boards.map(board => {
    "Update": decrementOperation(client, board, status)
  });

  // Combine all operations into a single transaction for DynamoDB
  let transactionParams = {
    "TransactItems": deleteOperation.concat(boardOperations)
  };

  try {
    let result = await client.transactWrite(transactionParams).promise();
    return true;
  } catch (err) {
    console.log(`Unable to delete old snippet due to error from AWS: ${err}`);
    throw err;
  }
}

export async function changeStatus(client, oldStatus, created, newStatus) {

  let o = await getSnippet(client, oldStatus, created);

  // One operation to delete the old snippet in the cardi-notes table
  let deleteOperation = [{
    "Delete": deleteOperation(client, status)
  }];

  // One operation to create the new snippet in the cardi-notes table
  let createOperation = [{
    "Put": createOperation(client, newStatus, created, o.title, o.content, o.boards, o.search)
  }];

  // One operation PER BOARD to the cardi-boards table to decrease old status
  let decBoardOperations = o.boards.map(board => {
    "Update": decrementOperation(client, board, oldStatus)
  });

  // One operation PER BOARD to the cardi-boards table to increase new status
  let incBoardOperations = o.boards.map(board => {
    "Update": incrementOperation(client, board, newStatus)
  });

  // Combine all operations into a single transaction for DynamoDB
  let transactionParams = {
    "TransactItems": deleteOperation + createOperation + decBoardOperations + incBoardOperations
  };

  try {
    let result = await client.transactWrite(transactionParams).promise();
    return true;
  } catch (err) {
    console.log(`Unable to change snippet status due to error from AWS: ${err}`);
    throw err;
  }
}

export async function changeBoards(client, status, created, boards, action) {

  // One operation to change the existing snippet in the cardi-notes table
  let changeOperation = [{
    "Update": updateBoardOperation(status, created, action, boards)
  }];

  // Choose here whether we're incrementing or decrementing board counts
  let boardFunction = (action == "ADD") ? incrementOperation ? decrementOperation;

  // One operation PER BOARD to the cardi-boards table to update counts
  let boardOperations = boards.map(board => {
    "Update": boardFunction(client, board, status)
  });

  // Combine all operations into a single transaction for DynamoDB
  let transactionParams = {
    "TransactItems": changeOperation.concat(boardOperations)
  };

  try {
    let result = await client.transactWrite(transactionParams).promise();
    return true;
  } catch (err) {
    console.log(`Unable to change snippet boards due to error from AWS: ${err}`);
    throw err;
  }
}
