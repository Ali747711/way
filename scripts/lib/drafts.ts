/**
 * Pulls the array of drafts out of a model reply. The reply should be a bare
 * JSON array, but models sometimes wrap it in a code fence, add a sentence
 * around it, or return `{ "elements": [...] }`; all of those are accepted.
 * Each element is validated later, one by one, so a single bad draft does not
 * cost the whole batch.
 */
export const extractDraftArray = (text: string): unknown[] => {
  const starts = [text.indexOf('['), text.indexOf('{')].filter((i) => i >= 0);
  if (starts.length === 0) throw new Error('reply holds no JSON');
  const start = Math.min(...starts);
  const end = Math.max(text.lastIndexOf(']'), text.lastIndexOf('}'));
  if (end < start) throw new Error('reply holds no JSON');

  const value: unknown = JSON.parse(text.slice(start, end + 1));
  if (Array.isArray(value)) return value;
  if (
    value !== null &&
    typeof value === 'object' &&
    'elements' in value &&
    Array.isArray(value.elements)
  ) {
    return value.elements;
  }
  throw new Error('reply JSON is not an array of drafts');
};
