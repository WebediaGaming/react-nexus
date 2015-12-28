import _ from 'lodash';
import deepEqual from 'deep-equal';

/**
 * Diffs two object hashes, returning an array of two hashes:
 * - an object containing the removed properties and their previous values,
 * - on object containg the added properties and their new values.
 * Mutated properties (properties present in both prev and next but with different values) are present in both objects.
 * @param {Object} next The next object
 * @param {Object} prev The previous object
 * @param {Function?} eql = deepEqual An optional equality function (defaults to deepEqual from 'deep-equal')
 * @return {Array} An array containing two objects: the removed properties, and the added properties.
 */
function diff(next, prev, eql = deepEqual) {
  return [
    _.pick(prev, (v, k) => !_.has(next, k) || !eql(next[k], v)),
    _.pick(next, (v, k) => !_.has(prev, k) || !eql(prev[k], v)),
  ];
}

export default diff;
