const { describe, it } = global;
import should from 'should/as-function';

import virtual from '../virtual';

describe('virtual', () => {
  it('throws when virtual method is invoked on base class', () => {
    class A {
      @virtual
      foo() {}
    }
    should(() => (new A()).foo()).throw();
  });
  it('throws when virtual method is invoked on derived class', () => {
    class A {
      @virtual
      foo() {}
    }
    class B extends A {}
    should(() => (new B()).foo()).throw();
  });
  it('throws not when extend method is invoked on derived class', () => {
    class A {
      @virtual
      foo() {}
    }
    class B extends A {
      foo() {}
    }
    should(() => (new B()).foo()).not.throw();
  });
});
