const { describe, it } = global;
import should from 'should/as-function';

import diff from '../diff';

describe('diff', () => {
  it('returns no-op diff for identical objects', () => {
    should(diff({}, {})).eql([{}, {}]);
    should(diff(
      { foo: 'bar' },
      { foo: 'bar' },
    )).eql([{}, {}]);
  });
  it('returns correct diff for different objects', () => {
    should(diff(
      { foo: 'bar', fizz: 'bozz', theta: 'alpha' }, // next
      { foo: 'bar', fizz: 'buzz', beta: 'gamma' }, // prev
    )).eql([
      { fizz: 'buzz', beta: 'gamma' }, // removed
      { fizz: 'bozz', theta: 'alpha' }, // added
    ]);
  });
});
