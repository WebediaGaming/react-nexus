const { describe, it } = global;
import Promise from 'bluebird';
import HTTPStatus from 'http-status-codes';
import _ from 'lodash';
import nock from 'nock';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import should from 'should/as-function';
import sinon from 'sinon';
import url from 'url';

import Flux from '../../Flux';
import HttpStore from '../../HttpStore';
import preparable from '../../preparable';
import prepare from '../../prepare';
import stores from '../../stores';
import root from '../../root';

describe('prepare', () => {
  it('resolves to an identical context on DOM elements', () => {
    const context = { bar: 'foo' };
    return prepare(<div />, context)
    .then(() => should(context).be.deepEqual({ bar: 'foo' }));
  });
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
    const context = {};
    return prepare(<Test bar='foo' />, context)
    .then(() => should(context).have.property('bar').which.is.exactly('foo'));
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
  it('prepares stateless components correctly', async function test() {
    const StatelessComponent = () => null;
    StatelessComponent[preparable.$prepare] = async function preps(props, context) {
      context.bar = await Promise.resolve('foo');
    };
    const context = {};
    return await prepare(<StatelessComponent />, context)
      .then(() => should(context).have.property('bar').which.is.exactly('foo'));
  });
  it('doesn’t fetch the same HTTPStore more than once', async function test() {
    const testHttpConf = {
      protocol: 'http',
      hostname: 'test.example.local',
      port: '42',
    };
    const testStorePath = '/testHttpStore';
    const apiMock = nock(url.format(testHttpConf))
      .get(testStorePath).reply(HTTPStatus.OK, { message: 'Hello world' });
    const testHttpStore = HttpStore.create(testStorePath, testHttpConf);
    const flux = Flux.create({
      stores: [testHttpStore],
    });

    // Parent and child have the same store dependency.
    const getStoreDeps = _.constant({ testStore: testStorePath });

    @stores(getStoreDeps)
    class Child extends React.Component {
      static propTypes = {
        testStore: PropTypes.object,
      };
      render() {
        return <span>{this.props.testStore.value.message}</span>;
      }
    }

    @stores(getStoreDeps)
    class Parent extends React.Component {
      render() {
        return <Child />;
      }
    }

    @root()
    class RootComponent extends React.Component {
      render() {
        return <Parent />;
      }
    }

    const app = <RootComponent flux={flux} />;
    await prepare(app);

    should(apiMock.isDone()).be.exactly(true,
      `nock.isDone(): HTTP request expectations failed. Not requested: ${apiMock.pendingMocks()}`);

    const storeState = testHttpStore.readFromState({});

    // If store is rejected here, that means nock has thrown an error because it
    // received a second request it didn't expect.
    should(storeState.isRejected()).be.exactly(false, storeState.reason);
  });

  describe('preparedApp', () => {
    it('is rendered as the original app', () => {
      function Foo() {
        return <span>{'Foo'}</span>;
      }
      const app = <Foo />;
      return prepare(app)
      .then((preparedApp) => {
        const appHtml = ReactDOMServer.renderToString(app);
        const preparedAppHtml = ReactDOMServer.renderToString(preparedApp);
        should(preparedAppHtml).be.exactly(appHtml);
      });
    });
    it('is rendered as the original app with nested elements', () => {
      function Bar() {
        return <span>{'Bar'}</span>;
      }
      function Foo() {
        return <Bar />;
      }
      const app = <Foo />;
      return prepare(app)
      .then((preparedApp) => {
        const appHtml = ReactDOMServer.renderToString(app);
        const preparedAppHtml = ReactDOMServer.renderToString(preparedApp);
        should(preparedAppHtml).be.exactly(appHtml);
      });
    });
    it('is rendered as the original app with null children', () => {
      function Bar() {
        return null;
      }
      function Foo() {
        return (
          <div>
            {'Foo'}
            <Bar />
          </div>
        );
      }
      const app = <Foo />;
      return prepare(app)
      .then((preparedApp) => {
        const appHtml = ReactDOMServer.renderToString(app);
        const preparedAppHtml = ReactDOMServer.renderToString(preparedApp);
        should(preparedAppHtml).be.exactly(appHtml);
      });
    });
    it('is rendered as the original app with false children', () => {
      function Bar() {
        return false;
      }
      function Foo() {
        return (
          <div>
            {'Foo'}
            <Bar />
          </div>
        );
      }
      const app = <Foo />;
      return prepare(app)
      .then((preparedApp) => {
        const appHtml = ReactDOMServer.renderToString(app);
        const preparedAppHtml = ReactDOMServer.renderToString(preparedApp);
        should(preparedAppHtml).be.exactly(appHtml);
      });
    });
    it('is rendered as the original app with special elements', () => {
      function Foo() {
        return (
          <div>
            {'Foo'}
            <input />
          </div>
        );
      }
      const app = <Foo />;
      return prepare(app)
      .then((preparedApp) => {
        const appHtml = ReactDOMServer.renderToString(app);
        const preparedAppHtml = ReactDOMServer.renderToString(preparedApp);
        should(preparedAppHtml).be.exactly(appHtml);
      });
    });
    it('is rendered as the original app with empty native elements', () => {
      function Foo() {
        return (
          <div>
            {'Foo'}
            <div></div>
          </div>
        );
      }
      const app = <Foo />;
      return prepare(app)
      .then((preparedApp) => {
        const appHtml = ReactDOMServer.renderToString(app);
        const preparedAppHtml = ReactDOMServer.renderToString(preparedApp);
        should(preparedAppHtml).be.exactly(appHtml);
      });
    });
    it('is rendered as the original app with native elements which has null as child', () => {
      function Foo() {
        return (
          <div>
            {'Foo'}
            <div>{null}</div>
          </div>
        );
      }
      const app = <Foo />;
      return prepare(app)
      .then((preparedApp) => {
        const appHtml = ReactDOMServer.renderToString(app);
        const preparedAppHtml = ReactDOMServer.renderToString(preparedApp);
        should(preparedAppHtml).be.exactly(appHtml);
      });
    });
  });
});
