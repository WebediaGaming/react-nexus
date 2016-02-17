import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import createFlux from './createFlux';
const { port } = JSON.parse(new Buffer(window.__HTTP_CONFIG__, 'base64').toString('utf8'));
const reflux = createFlux({ port })
  .loadState(JSON.parse(new Buffer(window.__NEXUS_PAYLOAD__, 'base64').toString('utf8')));
ReactDOM.render(<App flux={reflux} />, document.getElementById('__App__'));
