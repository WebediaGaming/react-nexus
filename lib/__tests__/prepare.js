const { describe, it } = global;
import Promise from 'bluebird';
import should from 'should/as-function';
import React from 'react';
import sinon from 'sinon';

import preparable from '../preparable';
import prepare from '../prepare';

describe('prepare', () => {
  it('resolves to an identical context on DOM elements', () =>
    prepare(<div />, { bar: 'foo' })
    .then((context) => should(context).eql({ bar: 'foo' }))
  );
  it('prepares a simple element without context side effects', () => {
    const spy = sinon.spy();
    @preparable(() => Promise.resolve(spy()))
    class Test extends React.Component {
      render() {
        return null;
      }
    }
    prepare(<Test />, {})
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
    prepare(<Test bar='foo' />, {})
    .then((context) => should(context).have.property('bar').which.is.exactly('foo'));
  });
});
