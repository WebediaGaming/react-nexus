import React from 'react';

import Nexus from '../../..';
const { root } = Nexus;
import Users from './Users';

@root(({ createFlux }) => createFlux())
class App extends React.Component {
  static displayName = 'App';
  render() {
    return <Users />;
  }
}

export default App;
