import Nexus from '../';
import React from 'react';
import Nested from './Nested';

export default React.createClass({
  displayName: 'App',
  mixins: [Nexus.Mixin],

  getNexusBindings() {
    return {
      route: [this.getNexus().local, '/route'],
      notFound: [this.getNexus().local, '/notFound'],
    };
  },

  getInitialState() {
    return {
      foo: '/bar',
      clicks: 0,
    };
  },

  click() {
    this.setState({ clicks: this.state.clicks + 1 });
  },

  render() {
    const { route, foo, clicks } = this.state;
    return <div className='App'>
      <p>My route is {route ? route.get('path') : null} and foo is <Nested foo={foo} />.</p>
      <p>The clicks counter is {clicks}. <button onClick={this.click}>increase counter</button></p>
    </div>;
  },
});
