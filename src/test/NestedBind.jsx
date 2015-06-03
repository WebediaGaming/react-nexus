import Nexus from '../';
import React from 'react';

export default Nexus.bind(class extends React.Component {
  static displayName = 'NestedBind';

  static propTypes = {
    bar: React.PropTypes.any,
  };

  getNexusBindings({ foo }) {
    return {
      bar: ['local', foo],
    };
  }

  render() {
    const { bar } = this.props;
    return <span className='NestedBind'>{bar ? bar.get('mood') : null}</span>;
  }
}, ({ foo }) => ({ bar: ['local', foo] }));
