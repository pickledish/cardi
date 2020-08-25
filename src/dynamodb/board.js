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
