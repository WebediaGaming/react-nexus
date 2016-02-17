const { describe, it } = global;
import Promise from 'bluebird';
import React from 'react';
import should from 'should/as-function';
import sinon from 'sinon';

import preparable from '../../preparable';
const { $prepare } = preparable;

describe('preparable', () => {
  it('returns a React.Component with a [$prepare] static property', () => {
    class Test extends React.Component {}
    const PreparableTest = preparable(() => Promise.resolve())(Test);
    should(PreparableTest).have.property($prepare).which.is.a.Function();
  });
  it('static method settles correctly', async function test() {
    const delay = 100;
    const spy = sinon.spy();
    class Test extends React.Component {}
    const PreparableTest = preparable(async function prepare() {
      await Promise.resolve(spy()).delay(delay);
    })(Test);
    await PreparableTest[$prepare]();
    should(spy).have.property('calledOnce').which.is.exactly(true);
  });
  it('preparable decorator static method settles correctly', async function test() {
    const delay = 100;
    const spy = sinon.spy();
    @preparable(async function prepare() {
      await Promise.resolve(spy()).delay(delay);
    })
    class Test extends React.Component {}
    await Test[$prepare]();
    should(spy).have.property('calledOnce').which.is.exactly(true);
  });
  it('correctly chains preparations', async function test() {
    const delay = 100;
    const spy = sinon.spy();
    @preparable(async function testA() {
      await Promise.resolve(spy('A')).delay(delay);
    })
    @preparable(async function testB() {
      await Promise.resolve(spy('B')).delay(delay);
    })
    class Test extends React.Component {}
    await Test[$prepare]();
    should(spy).have.property('callCount').which.is.exactly(2);
    should(spy.getCall(0).args).be.deepEqual(['B']);
    should(spy.getCall(1).args).be.deepEqual(['A']);
  });
});
