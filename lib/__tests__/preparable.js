const { describe, it } = global;
import Promise from 'bluebird';
import React from 'react';
import should from 'should/as-function';
import sinon from 'sinon';

import preparable from '../preparable';
const { $preparable } = preparable;

describe('preparable', () => {
  it('returns a React.Component with a [$preparable] static property', () => {
    class Test extends React.Component {}
    const PreparableTest = preparable(() => Promise.resolve())(Test);
    should(PreparableTest).have.property($preparable).which.is.a.Function();
  });
  it('static method settles correctly', () => {
    const delay = 100;
    const spy = sinon.spy();
    class Test extends React.Component {}
    const PreparableTest = preparable(() => Promise.resolve(spy()).delay(delay))(Test);
    return PreparableTest[$preparable]()
    .then(() => should(spy).have.property('calledOnce').which.is.exactly(true));
  });
  it('preparable decorator static method settles correctly', () => {
    const delay = 100;
    const spy = sinon.spy();
    @preparable(() => Promise.resolve(spy()).delay(delay))
    class Test extends React.Component {}
    return Test[$preparable]()
    .then(() => should(spy).have.property('calledOnce').which.is.exactly(true));
  });
});
