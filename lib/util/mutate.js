import _ from 'lodash';
import deepEqual from 'deep-equal';

/**
 * Diffs a previous state getter and a mutation object, returning an array of three hashes:
 * - an object containing the properties to delete (valued to void 0 in next)
 * - an object containing the properties to add (present in next but not in prev)
 * - an object containing the properties to update (present in both next and prev)
 * This mimicks and generalizes the behaviour of React.Component#setState.
 * @param {Object} next The mutations object
 * @param {Object} prev The previous state getter
 * @param {Function?} eql = deepEqual An optional equality function (defaults to deepEqual from 'deep-equal')
 * @return {Array} An array containing three objects: the properties to delete, the properties to add, and the
 *                    properties to update.
 */
function mutate(next, prev, eql = deepEqual) {
  return [
    _.pick(next, (v, k) => v === void 0 && prev(k) !== void 0),
    _.pick(next, (v, k) => v !== void 0 && prev(k) === void 0),
    _.pick(next, (v, k) => v !== void 0 && prev(k) !== void 0 && !eql(prev(k), next[k])),
  ];
}

export default mutate;
