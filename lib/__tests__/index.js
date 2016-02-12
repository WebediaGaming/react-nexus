import should from 'should/as-function';
const { describe, it } = global;

import {
  Action,
  actions,
  deps,
  Flux,
  preparable,
  prepare,
  root,
  Store,
  stores,
  HTTPStore,
  MemoryStore,
} from '../';
import ComplexClass from './fixtures/ComplexClass';

describe('sanity', () => {
  it('shouldjs should not extend Object.prototype', () => should(Object.prototype).not.have.property('should'));
  it('Complex class transforms should work', () => {
    const TEN = 10;
    const THIRTYFIVE = 35;
    const inst = new ComplexClass(TEN);
    should(inst).be.an.instanceOf(ComplexClass);
    should(inst.v).be.exactly(TEN);
    const multiplyByFortyFive = inst.multiplyByFortyFive;
    should(multiplyByFortyFive()).be.exactly(TEN * THIRTYFIVE);
    should(ComplexClass.multiplyByFortyFive(TEN)).be.exactly(TEN * THIRTYFIVE);
  });
});

describe('index', () =>
  it('should expose correctly the components of the library', () => {
    should(Action).be.a.Function();
    should(actions).be.a.Function();
    should(deps).be.a.Function();
    should(Flux).be.a.Function();
    should(preparable).be.a.Function();
    should(prepare).be.a.Function();
    should(root).be.a.Function();
    should(Store).be.a.Function();
    should(stores).be.a.Function();
    should(HTTPStore).be.a.Function();
    should(MemoryStore).be.a.Function();
  })
);
