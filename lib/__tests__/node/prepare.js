const { describe, it } = global;
import Promise from 'bluebird';
import should from 'should/as-function';
import React from 'react';
import sinon from 'sinon';

import preparable from '../../preparable';
import prepare from '../../prepare';

describe('prepare', () => {
  it('resolves to an identical context on DOM elements', () =>
    prepare(<div />, { bar: 'foo' })
    .then((context) => should(context).be.deepEqual({ bar: 'foo' }))
  );
  it('prepares a simple element without context side effects', () => {
    const spy = sinon.spy();
    @preparable(() => Promise.resolve(spy()))
    class Test extends React.Component {
      render() {
        return null;
      }
    }
    return prepare(<Test />, {})
    .then(() => should(spy).have.property('calledOnce').which.is.exactly(true));
  });
  it('prepares a simple element with context side effects', () => {
    const delay = 100;
    @preparable(({ bar }, context) => Promise.try(() => {
      context.bar = bar;
    }).delay(delay))
    class Test extends React.Component {
      render() {
        return this.context.bar;
      }
    }
    return prepare(<Test bar='foo' />, {})
    .then((context) => should(context).have.property('bar').which.is.exactly('foo'));
  });
  it('prepares nested elements', () => {
    const spy = sinon.spy();
    const expectedNumberOfCalls = 3;
    @preparable(() => Promise.resolve(spy()))
    class Test extends React.Component {
      render() {
        return null;
      }
    }
    return prepare(<div>
      <Test />
      <div>
        <Test />
      </div>
      <div>
        <div />
        <div>
          <Test />
        </div>
      </div>
    </div>, {})
    .then(() => should(spy).have.property('callCount').which.is.exactly(expectedNumberOfCalls));
  });
  it('prepares nested components', () => {
    const prepareOuter = sinon.spy();
    const prepareInner = sinon.spy();
    @preparable(() => Promise.resolve(prepareInner()))
    class Inner extends React.Component {
      render() {
        return null;
      }
    }
    @preparable(() => Promise.resolve(prepareOuter()))
    class Outer extends React.Component {
      render() {
        return <Inner />;
      }
    }
    return prepare(<Outer />, {})
    .then(() => {
      should(prepareOuter).have.property('calledOnce').which.is.exactly(true);
      should(prepareInner).have.property('calledOnce').which.is.exactly(true);
    });
  });
});
