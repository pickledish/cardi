/*
The following is a brief outline of the public API, which every client
supporting a new backend must adhere to for cardi:

export class GenericClient {
  constructor(opts) {}
  async ensureTables() {};
  async getSnippet(status, created) {};
  async getSnippets(struct) {};
  async createSnippet(status, created, title, content, boards, search, image) {};
  async updateSnippet(created, title, content, search) {};
  async changeStatus(oldStatus, created, newStatus) {};
  async deleteSnippet(created) {};
  async changeBoards(status, created, boards, action) {};
  async getBoards() {};
};

If the client doesn't have each of these methods, it won't work.
*/

import { DynamoDbClient } from './dynamodb/client.js';

export function getClient(backend, opts) {

  if (backend == "dynamodb") {
    return new DynamoDbClient(opts);
  } else {
    throw `Cannot create client with unsupported backend ${backend}`;
  }

}
