import Nexus from '../';
import React from 'react';

export default @Nexus.inject(({ foo }) => ({
  bar: ['local', foo],
}))
class extends React.Component {
  static displayName = 'NestedInject';

  static propTypes = {
    bar: React.PropTypes.any,
  };

  render() {
    const { bar } = this.props;
    return <span className='NestedInject'>{bar ? bar.get('mood') : null}</span>;
  }
}
