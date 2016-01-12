import React from 'react';

import Nexus from '../../..';
const { root } = Nexus;

@root(({ createFlux }) => createFlux())
class App extends React.Component {
  render() {
    return <div>{'App'}</div>;
  }
}

export default App;
