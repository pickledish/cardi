// ----------------------------------------------------------------------------
// Public API
// ----------------------------------------------------------------------------

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

export async function incrementBoard(client, boardId, status) {
  let params = {
    'TableName': 'cardi-boards',
    'Key': {
      'created': boardId,
    },
    'AttributeUpdates': {
      [status]: {
        'Action': 'ADD',
        'Value': 1,
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

export async function decrementBoard(client, boardId, status) {
  let params = {
    'TableName': 'cardi-boards',
    'Key': {
      'created': boardId,
    },
    'AttributeUpdates': {
      [status]: {
        'Action': 'ADD',
        'Value': -1,
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
