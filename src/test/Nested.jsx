import Nexus from '../';
import React from 'react';

export default React.createClass({
  displayName: 'Nested',
  mixins: [Nexus.Mixin],

  getNexusBindings(props) {
    return {
      bar: [this.getNexus().local, props.foo],
    };
  },

  render() {
    const { bar } = this.state;
    return <span>{bar ? bar.get('mood') : null}</span>;
  },
});
