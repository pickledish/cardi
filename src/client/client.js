/*
The following is a brief outline of the public API, which every client
supporting a new backend must adhere to for cardi:

function GenericClient() {
  this.ensureTable = async function() {};
  this.getSnippets = async function() {};
  this.createSnippet = async function() {};
  this.updateSnippet = async function() {};
  this.changeStatus = async function() {};
  this.deleteSnippet = async function() {};
  this.changeBoards = async function() {};
};

If the client doesn't have each of these methods, it won't work.
*/

function getClient(backend) {

  if (backend == "dynamodb") {
    return new DynamoDbClient(accessKey, secretKey);
  } else if (backend == "pouchdb") {
    return null; // NOT IMPLEMENTED YET STAY TUNED
  } else {
    throw `Cannot create client with unsupported backend ${backend}`;
  }

}
