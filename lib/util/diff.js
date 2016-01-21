import _ from 'lodash';

function changedProperties(prev, next, eql) {
  return _(prev)
    .toPairs()
    .filter(([k, v]) => !next.hasOwnProperty(k) || !eql(next[k], v))
    .fromPairs()
  .value();
}

const shallowEqual = (x, y) => x === y;

/**
 * Diffs two object hashes, returning an array of two hashes:
 * - an object containing the removed properties and their previous values,
 * - on object containg the added properties and their new values.
 * Mutated properties (properties present in both prev and next but with different values) are present in both objects.
 * @param {Object} next The next object
 * @param {Object} prev The previous object
 * @param {Function?} eql = shallowEqual An optional equality function (defaults to ===)
 * @return {Array} An array containing two objects: the removed properties, and the added properties.
 */
function diff(next, prev, eql = shallowEqual) {
  return [
    changedProperties(prev, next, eql),
    changedProperties(next, prev, eql),
  ];
}

export default diff;
