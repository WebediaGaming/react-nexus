const { describe, it } = global;
import should from 'should/as-function';

import virtual from '../virtual';

describe('virtual', () => {
  it('throws when virtual method is invoked on base class', () => {
    class A {
      @virtual
      static foo() {}
      @virtual
      foo() {}
    }
    should(() => A.foo()).throw();
    should(() => (new A()).foo()).throw();
  });
  it('throws when virtual method is invoked on derived class', () => {
    class A {
      @virtual
      static foo() {}
      @virtual
      foo() {}
    }
    class B extends A {}
    should(() => B.foo()).throw();
    should(() => (new B()).foo()).throw();
  });
  it('throws not when extend method is invoked on derived class', () => {
    class A {
      @virtual
      static foo() {}
      @virtual
      foo() {}
    }
    class B extends A {
      static foo() {}
      foo() {}
    }
    should(() => B.foo()).not.throw();
    should(() => (new B()).foo()).not.throw();
  });
});
