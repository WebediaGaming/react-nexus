const { describe, it } = global;
import isExtensionOf from '../isExtensionOf';
import should from 'should/as-function';

describe('isExtensionOf', () => {
  it('extended class should be an extension of base class', () => {
    class A {}
    class B extends A {}
    should(isExtensionOf(B, A)).be.true();
  });
  it('base class should not be an extension of another base class', () => {
    class A {}
    class B {}
    should(isExtensionOf(B, A)).not.be.true();
  });
  it('indirect extension should be an extension of base class', () => {
    class A {}
    class B extends A {}
    class C extends B {}
    should(isExtensionOf(C, A)).be.true();
  });
});
