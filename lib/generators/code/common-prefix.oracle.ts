// Oracle: start with the first word and shorten it until every word starts with it.
export const oracle = ([words]: unknown[]): string => {
  const list = words as string[];
  if (list.length === 0) return '';
  let prefix = list[0];
  while (!list.every((word) => word.startsWith(prefix))) {
    prefix = prefix.slice(0, -1);
  }
  return prefix;
};
