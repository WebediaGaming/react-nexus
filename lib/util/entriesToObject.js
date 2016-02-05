/**
 * Creates an object from an array of key/value pairs.
 * @param {Array<Array>} entries Pairs of key/value
 * @return {Object} Resulting object
 */
export default function entriesToObject(entries) {
  const o = {};
  for(const [k, v] of entries) {
    o[k] = v;
  }
  return o;
}
