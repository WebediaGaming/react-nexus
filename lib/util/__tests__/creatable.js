const { describe, it } = global;
import should from 'should/as-function';

import creatable from '../creatable';
describe('creatable', () => {
  it('decorates class with a create static method which acts as a factory', () => {
    @creatable
    class A {
      constructor(foo) {
        this.foo = foo;
      }
    }
    const a = A.create('bar');
    should(a).be.an.instanceOf(A).which.has.property('foo').which.is.exactly('bar');
  });
});
