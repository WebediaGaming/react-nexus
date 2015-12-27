const { describe, it } = global;
import isExtensionOf from '../isExtensionOf';
import should from 'should/as-function';

describe('isExtensionOf(B, A)', () => {
  it('returns true when B extends A', () => {
    class A {}
    class B extends A {}
    should(isExtensionOf(B, A)).be.true();
  });
  it('returns false when B doesn\'t extend A', () => {
    class A {}
    class B {}
    should(isExtensionOf(B, A)).not.be.true();
  });
  it('returns true when B extends C which extends A', () => {
    class A {}
    class C extends A {}
    class B extends C {}
    should(isExtensionOf(B, A)).be.true();
  });
});
