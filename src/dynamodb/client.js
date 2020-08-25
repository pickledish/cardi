// ----------------------------------------------------------------------------
// Low-level client needed to do operations on tables, etc
// ----------------------------------------------------------------------------

export function lowLevelClient(accessKey, secretKey) {
  return new AWS.DynamoDB({
    "region": "us-east-2",
    "accessKeyId": accessKey,
    "secretAccessKey": secretKey,
  });
}

// ----------------------------------------------------------------------------
// High-level client used for CRUD operations on table rows, etc
// ----------------------------------------------------------------------------

export function documentClient(accessKey, secretKey) {
  return new AWS.DynamoDB.DocumentClient({
    "region": "us-east-2",
    "accessKeyId": accessKey,
    "secretAccessKey": secretKey,
  });
}
