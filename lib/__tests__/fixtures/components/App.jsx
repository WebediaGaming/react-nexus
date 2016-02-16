import React from 'react';

import { root } from '../../..';
import Users from './Users';

export default root()(class App extends React.Component {
  static displayName = 'App';

  render() {
    return <div className='App'>
      <Users />
    </div>;
  }
});
