import {ensureTables} from './table.js';
import {getSnippet, getSnippets, createSnippet, updateSnippet, changeStatus, deleteSnippet, changeBoards} from './note.js';
import {getBoards} from './board.js';

export class DynamoClient {

  constructor(opts) {
    this.tableClient = new AWS.DynamoDB({
      "region": "us-east-2",
      "accessKeyId": opts["accessKey"],
      "secretAccessKey": opts["secretKey"],
    });
    this.documentClient = new AWS.DynamoDB.DocumentClient({
      "region": "us-east-2",
      "accessKeyId": opts["accessKey"],
      "secretAccessKey": opts["secretKey"],
    });
  }

  async ensureTables() {
    return ensureTables(this.tableClient);
  };

  async getSnippet(status, created) {
    return getSnippet(this.documentClient, status, created);
  };

  async getSnippets(struct) {
    return getSnippets(this.documentClient, struct);
  };

  async createSnippet(status, created, title, content, boards, search, image) {
    return createSnippet(this.documentClient, status, created, title, content, boards, search, image);
  };

  async updateSnippet(created, title, content, search) {
    return updateSnippet(this.documentClient, created, title, content, search);
  };

  async changeStatus(oldStatus, created, newStatus) {
    return changeStatus(this.documentClient, oldStatus, created, newStatus);
  };

  async deleteSnippet(created) {
    return deleteSnippet(this.documentClient, created);
  };

  async changeBoards(status, created, boards, action) {
    return changeBoards(this.documentClient, status, created, boards, action);
  };

  async getBoards() {
    return getBoards(this.documentClient);
  };

};
