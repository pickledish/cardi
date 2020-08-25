import { porterStem } from './stemmer.js'

let stopWords = new Set([
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it",
  "for","not", "on", "with", "he", "as", "you", "do", "at", "this", "but",
  "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will",
  "my", "one", "all", "would", "there", "their", "what", "so", "up", "out",
  "if", "about", "who", "get", "me", "http", "https", "www", "com", "html"
]);

function tokenize(input) {
  let separator = new RegExp("[^a-zA-Z0-9]");
  let lower = input.toLowerCase();
  let tokens = lower.split(separator);
  return tokens.filter(word => word.length > 1);
}

// todo: also remove duplicates

function stopwords(tokens) {
  return tokens.filter(word => !stopWords.has(word));
}

function stemmer(tokens) {
  return tokens.map(word => porterStem(word));
}

export function toSearchKeys(input) {
  return stemmer(stopwords(tokenize(input)));
}
