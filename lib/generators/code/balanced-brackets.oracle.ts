// Oracle: keep only brackets, then delete adjacent matched pairs until nothing changes.
export const oracle = ([text]: unknown[]): boolean => {
  let rest = (text as string).replace(/[^()[\]{}]/g, '');
  let before = '';
  while (rest !== before) {
    before = rest;
    rest = rest.replace('()', '').replace('[]', '').replace('{}', '');
  }
  return rest === '';
};
