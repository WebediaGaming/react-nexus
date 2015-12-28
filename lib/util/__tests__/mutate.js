const { describe, it } = global;
import should from 'should/as-function';

import mutate from '../mutate';

function _get(o) {
  return (k) => o[k];
}

describe('mutate', () => {
  it('returns no-op mutations for empty mutation set', () => {
    should(mutate({}, _get({}))).eql([{}, {}, {}]);
  });
  it('returns correct mutations for non-empty mutation set', () => {
    should(mutate(
      { foo: 'bar', fizz: 'bozz', theta: 'alpha', fuzz: void 0 }, // next
      _get({ foo: 'bar', fizz: 'buzz', beta: 'gamma', fuzz: 'baz' }), // prev
    )).eql([
      { fuzz: void 0 }, // delete
      { theta: 'alpha' }, // add
      { fizz: 'bozz' }, // update
    ]);
  });
});
