function DynamoDbClient(accessKey, secretKey) {

  tableClient = new AWS.DynamoDB({
    "region": "us-east-2",
    "accessKeyId": accessKey,
    "secretAccessKey": secretKey,
  });

  documentClient = new AWS.DynamoDB.DocumentClient({
    "region": "us-east-2",
    "accessKeyId": accessKey,
    "secretAccessKey": secretKey,
  });

  this.boards = null;

  this.ensureTable = async function() {};

  this.getSnippets = async function() {};
  this.createSnippet = async function() {};
  this.updateSnippet = async function() {};
  this.changeStatus = async function() {};
  this.deleteSnippet = async function() {};

  this.getBoards = async function() {};
  this.changeBoards = async function() {};

};
