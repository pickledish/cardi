// ----------------------------------------------------------------------------
// Public API
// ----------------------------------------------------------------------------

export function incrementBoardOp(board, status) {
  return {
    'Update': {
      'TableName': 'cardi-boards',
      'Key': {
        'created': board,
      },
      'UpdateExpression': `ADD #status :value`,
      'ExpressionAttributeNames': {
        '#status': status,
      },
      'ExpressionAttributeValues': {
        ':value': 1,
      },
    }
  }
}

export function decrementBoardOp(board, status) {
  return {
    'Update': {
      'TableName': 'cardi-boards',
      'Key': {
        'created': board,
      },
      'UpdateExpression': `ADD #status :value`,
      'ExpressionAttributeNames': {
        '#status': status,
      },
      'ExpressionAttributeValues': {
        ':value': -1,
      },
    }
  }
}

export function decIncBoardOp(board, decStatus, incStatus) {
  return {
    'Update': {
      'TableName': 'cardi-boards',
      'Key': {
        'created': board,
      },
      'UpdateExpression': `ADD #decStatus :decValue, #incStatus :incValue`,
      'ExpressionAttributeNames': {
        '#decStatus': decStatus,
        '#incStatus': incStatus,
      },
      'ExpressionAttributeValues': {
        ':decValue': -1,
        ':incValue': 1,
      },
    }
  }
}

export function createBoardOp(name, status) {
  return {
    "Put": {
      'TableName': 'cardi-boards',
      'Item': {
        "created": dayjs().valueOf(),
        "archived": (status == "archived") ? 1 : 0,
        "current": (status == "current") ? 1 : 0,
        "name": name,
      }
    }
  }
}

export function deleteBoardOp(board) {
  return {
    "Delete": {
      'TableName': 'cardi-boards',
      'Key': {
        'created': board,
      }
    }
  }
}

export async function getBoards(client) {

  let params = {
    'TableName': 'cardi-boards',
  };

  try {
    let data = await client.scan(params).promise();
    return data['Items'];
  } catch (err) {
    console.log(err);
    return err;
  }
}
