import Nexus from '../';
import React from 'react';
import NestedBind from './NestedBind';
import NestedInject from './NestedInject';
import NestedInjector from './NestedInjector';
const { Injector } = Nexus;

export default Nexus.bind(class App extends React.Component {

  static propTypes = {
    route: React.PropTypes.any,
  };

  getNexusBindings() {
    return {
      route: ['local', '/route'],
    };
  }

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
    return (<div className='App'>
      <p>My route is { route ? route.get('path') : null} and foo is <NestedBind foo={ foo } />.</p>
      <p>My route is { route ? route.get('path') : null} and foo is <NestedInject foo={ foo } />.</p>
      <p>The clicks counter is { clicks }. <button onClick={ () => this.click() }>increase counter</button></p>
      <Injector etc={['local', '/etc', {}]}>
        {({ etc }) => <NestedInjector etc={etc} />}
      </Injector>
    </div>);
  }
});
