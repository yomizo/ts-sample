export const counter = () => {
  let count = 0;
  const increment = () => (count += 1);
  return increment;
};

export const sleep = async (time: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const convertWord = (
  word: string,
  excludedRegx: RegExp,
  existsWords: string[]
) => {
  if (excludedRegx.test(word)) {
    return `${word}$`;
  } else if (existsWords.includes(word)) {
    return `${word}@`;
  } else {
    return word;
  }
};
