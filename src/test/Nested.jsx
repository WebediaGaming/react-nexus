import Nexus from '../';
import React from 'react';

class Nested extends React.Component {
  static displayName = 'Nested';

  static propTypes = {
    bar: React.PropTypes.any,
  };

  render() {
    const { bar } = this.props;
    return <span>{bar ? bar.get('mood') : null}</span>;
  }
}

export default Nexus.Enhance(Nested, ({ foo }) =>
  ({ bar: ['local', foo] })
);
