import {ensureTables} from '../dynamodb/table.js';
import {getSnippet, getSnippets, createSnippet, updateSnippet, changeStatus, deleteSnippet, changeBoards} from '../dynamodb/note.js';
import {getBoards} from '../dynamodb/board.js';

import { invoke } from '@tauri-apps/api'

export class TauriGitClient {

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
    let resp = await invoke('get', { request: { repository: "local", table: "snippets", key: "12345" }});
    return [resp];
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
