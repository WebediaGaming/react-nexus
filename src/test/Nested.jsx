import Nexus from '../';
import React from 'react';

export default Nexus.Enhance(class Nested extends React.Component {
  static displayName = 'Nested';

  static propTypes = {
    bar: React.PropTypes.any,
  };

  render() {
    const { bar } = this.props;
    return <span>{bar ? bar.get('mood') : null}</span>;
  }
}, function getNexusBindings({ foo }) {
  return {
    bar: ['local', foo],
  };
});
