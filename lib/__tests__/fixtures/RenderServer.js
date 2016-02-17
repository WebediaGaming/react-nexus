import Promise from 'bluebird';
import createApp from 'koa';
import ReactDOMServer from 'react-dom/server';
import should from 'should/as-function';
import React from 'react';
import Nexus from '../../';

import App from './components/App';
import createFlux from './createFlux';
import pageTemplate from './pageTemplate';

const __DEV__ = process.env.NODE_ENV === 'development';

// These symbols enumerate the possible states of a Server instance
const [NOT_STARTED, STARTED, STOPPED] = [Symbol('NOT_STARTED'), Symbol('STARTED'), Symbol('STOPPED')];

class RenderServer {
  /**
   * koa app
   * @type {Object}
   */
  app = null;

  /**
   * server status
   * @type {Symbol}
   */
  _status = null;

  /**
   * server instance
   * @type {Object}
   */
  server = null;

  constructor(config) {
    this._status = NOT_STARTED;
    this.app = createApp();
    this.config = config;
    const { apiPort } = config;

    this.app.use(function* render() {
      const flux = createFlux({ port: apiPort });
      const app = <App flux={flux} />;
      yield Nexus.prepare(app);
      this.body = pageTemplate({
        title: 'UserList',
        appHtml: ReactDOMServer.renderToString(app),
        nexusPayload: JSON.stringify(flux.dumpState()),
        httpConfig: JSON.stringify({ port: apiPort }),
      });
    });
  }

  /**
   * Start listening for incoming requests
   * @return {Promise} Resolves when/if the server successfully starts
   */
  startListening() {
    const { port } = this.config;
    return new Promise((resolve, reject) => {
      if(__DEV__) {
        should(this._status).be.exactly(NOT_STARTED);
      }

      // Grab a reference to the HTTPServer instance so we can close it later
      this.server = this.app.listen(port, (err) => {
        if(err) {
          return reject(err);
        }
        return resolve();
      });
    })
    .then(() => {
      this._status = STARTED;
    });
  }

  /**
   * Stop listening for incoming requests
   * @return {Promise} Resolves when/if the server successfully stops
   */
  stopListening() {
    return Promise.try(() => {
      if(__DEV__) {
        should(this._status).be.exactly(STARTED);
      }
      return Promise.resolve(this.server.close());
    })
    .then(() =>
      this._status = STOPPED
    );
  }
}

export default RenderServer;
