/**
 * TODO: Can replace with Map.groupBy once it's available
 *
 * @template T
 * @param {Iterable<T>} iterable
 * @param {(key: T) => string} keySelector
 * @returns {Map<string, T[]>}
 */
export function groupBy(iterable, keySelector) {
  let map = new Map();
  for (let item of iterable) {
    let key = keySelector(item);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(item);
  }
  return map;
}
