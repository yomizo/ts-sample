import { fetchHtml } from "../infrastructures/fetch";
import { convertWord, sleep } from "../utils";

const WIKI_URL = "https://ja.wikipedia.org/wiki";

export type Tree = Map<string, Tree>;

export const fetchLinkWordsFromWiki = async (
  subject: string,
  existsWords: string[]
): Promise<string[]> => {
  try {
    const document = await fetchHtml(`${WIKI_URL}/${subject}`);
    const nodes = document
      ?.querySelector(`div.mw-parser-output > p`)
      ?.querySelectorAll(`a[href^="/wiki/"]`);
    if (nodes) {
      const overviews = Array.from(nodes, (href) =>
        convertWord(href!.textContent!.trim(), /[語学]$/, existsWords)
      );
      existsWords.push(...overviews);
      return overviews;
    } else {
      return [];
    }
  } catch (err) {
    throw new Error(`couldn't find your word.`);
  }
};

export const batchFetchWordsFromWiki = async (
  existsWords: string[],
  count: number,
  treeList: Tree[],
  searchLimit: number
) => {
  if (count < searchLimit) {
    for (let i = 0; i < treeList.length; i++) {
      const tree = treeList[i];
      for (const subject of tree.keys()) {
        if (!/[$@]$/.test(subject)) {
          const overviews = await fetchLinkWordsFromWiki(subject, existsWords);
          count += 1;
          await sleep();
          overviews.forEach((o) => tree!.get(subject)!.set(o, new Map()));

          // "@" が出てきた時点で探索終了
          if (overviews.some((o) => /@$/.test(o))) {
            return;
          }
        }
        if (count === searchLimit) break;
      }
      if (count === searchLimit) break;
    }

    if (count < searchLimit) {
      const nextTreeList: Tree[] = [];
      for (let i = 0; i < treeList.length; i++) {
        const tree = treeList[i];
        for (const t of tree.values()) {
          nextTreeList.push(t);
        }
      }

      await batchFetchWordsFromWiki(
        existsWords,
        count,
        nextTreeList,
        searchLimit
      );
    }
  }
};

export const outputTree = async (tree: Tree, level: number) => {
  const spaces = [];
  for (let i = 0; i < level; i++) {
    spaces.push("    ");
  }
  for (const [k, v] of tree) {
    if (/[$@]$/.test(k)) {
      console.log(`${spaces.join("")}- ${k}`);
    } else if (!v.size) {
      console.log(`${spaces.join("")}- ${k}$`);
    } else {
      console.log(`${spaces.join("")}- ${k}`);
      outputTree(v, level + 1);
    }
  }
};
