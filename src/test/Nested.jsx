import Nexus from '../';
import React from 'react';

export default Nexus.bind(class extends React.Component {
  static displayName = 'Nested';

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
    return <span>{bar ? bar.get('mood') : null}</span>;
  }
}, ({ foo }) => ({ bar: ['local', foo] }));
