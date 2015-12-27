const { describe, it } = global;
import should from 'should/as-function';

import abstract from '../abstract';

describe('abstract', () => {
  it('throws when abstract class is instantiated', () => {
    @abstract
    class A {}
    should(() => new A()).throw();
  });
  it('throws not when extended class is instantiated', () => {
    @abstract
    class A {}
    class B extends A {
      constructor() {
        super();
      }
    }
    should(() => new B()).not.throw();
  });
  it('works with complex inheritance', () => {
    class A {}
    @abstract
    class B extends A {}
    class C extends B {}
    should(() => new A()).not.throw();
    should(() => new B()).throw();
    should(() => new C()).not.throw();
  });
});
