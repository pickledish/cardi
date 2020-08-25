// ----------------------------------------------------------------------------
// Secret inner workings
// ----------------------------------------------------------------------------

async function doesTableExist(client, name) {

  var params = {
    'TableName': name,
  };

  try {
    await client.describeTable(params).promise();
    return true;
  } catch (err) {
    // throws a ResourceNotFound if the table doesn't exist
    return false;
  }
}

async function ensureTable(client, tableName, hash, hashType, sort, sortType) {

  let exists = await doesTableExist(client, tableName);

  if (exists) {
    console.log(`Table ${tableName} already exists, not doing anything!`)
    return;
  } else {
    console.log(`Table ${tableName} does not exist yet, creating...`)
  }

  let attributes = [];
  let schema = [];

  if (sort) {
    attributes = [
      {
        'AttributeName': hash,
        'AttributeType': hashType,
      },
      {
        'AttributeName': sort,
        'AttributeType': sortType,
      },
    ]
    schema = [
      {
        'AttributeName': hash,
        'KeyType': "HASH",
      },
      {
        'AttributeName': sort,
        'KeyType': "RANGE",
      },
    ]
  } else {
    attributes = [
      {
        'AttributeName': hash,
        'AttributeType': hashType,
      },
    ]
    schema = [
      {
        'AttributeName': hash,
        'KeyType': "HASH",
      },
    ]
  }

  var params = {
    'TableName': tableName,
    'BillingMode': 'PAY_PER_REQUEST',
    'AttributeDefinitions': attributes,
    'KeySchema': schema,
  }

  try {
    await client.createTable(params).promise();
    // TODO: actually inspect the thing so you know!
    console.log(`Successfully created table ${tableName}!`);
    return;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// ----------------------------------------------------------------------------
// Public API
// ----------------------------------------------------------------------------

export async function ensureTables(client) {

  console.log('Ensuring tables for notes, boards, and meta exist...')

  let [res1, res2, res3] = await Promise.all([
    ensureTable(client, "cardi-notes", "status", "S", "created", "N"),
    ensureTable(client, "cardi-boards", "created", "N", null, null),
    ensureTable(client, "cardi-meta", "updated", "N", null, null),
  ]);

  console.log(`Results: ${res1}, ${res2}, ${res3}`);
}
