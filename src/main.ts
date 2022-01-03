import {
  batchFetchWordsFromWiki,
  outputTree,
  Tree,
} from "./domains/link-words";

const SEARCH_LIMIT = 10;

(async () => {
  const subject = process.argv[2];
  const tree: Tree = new Map().set(subject, new Map());
  await batchFetchWordsFromWiki([subject], 0, [tree], SEARCH_LIMIT);
  outputTree(tree, 0);
})();
