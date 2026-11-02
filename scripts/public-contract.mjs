/** Public product scope applies even while compatibility code is being retired. */
const retiredName = /billing|wallet|ai[_ -]?gateway|personal[_ -]?invitation[_ -]?code|mutation[_ -]?(?:history|cure)|repository[_ -]?mutations|(?:^|[\/_ -])(?:payments?|rewards?|tutorials?|muti)(?:$|[\/_ -])|(?:^|[_/-])licens(?:e|es|ing)(?:$|[_/-])/i;
const retiredScope = /^(?:mutations:(?:read|write)|billing:[a-z_]+)$/i;

export function isRetiredName(value) {
  return retiredName.test(value) || retiredScope.test(value);
}

export function publicContract(value) {
  if (Array.isArray(value)) return value.filter(item => typeof item !== 'string' || !isRetiredName(item)).map(publicContract);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key, item]) => !isRetiredName(key) && (typeof item !== 'string' || !isRetiredName(item)))
    .map(([key, item]) => [key, publicContract(item)]));
}
