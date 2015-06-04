import React from 'react';
import inject from './inject';

@inject((props) => _.omit(props, 'children'))
class Injector extends React.Component {
  static displayName = 'Injector';

  static propTypes = {
    children: React.PropTypes.func.isRequired,
  }

  render() {
    return this.props.children(_.omit(this.props, 'children'));
  }
}

export default Injector;
