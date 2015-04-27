import Nexus from '../';
import React from 'react';
import Nested from './Nested';

export default Nexus.Enhance(class App extends React.Component {
  static displayName = 'App';

  static propTypes = {
    route: React.PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = { foo: '/bar', clicks: 0 };
  }

  click() {
    this.setState({ clicks: this.state.clicks + 1 });
  }

  render() {
    const { foo, clicks } = this.state;
    const { route } = this.props;
    return <div className='App'>
      <p>My route is { route ? route.get('path') : null} and foo is <Nested foo={ foo } />.</p>
      <p>The clicks counter is { clicks }. <button onClick={ () => this.click() }>increase counter</button></p>
    </div>;
  }
}, function getNexusBindings() {
  return {
    route: ['local', '/route'],
  };
});
