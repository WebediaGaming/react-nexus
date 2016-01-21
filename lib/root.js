import React from 'react';

import Flux from './Flux';
import defaultFluxKey from './defaultFluxKey';

function root({ fluxKey = defaultFluxKey, displayName = void 0 } = {}) {
  return (Component) => {
    class RootComponent extends React.Component {
      static displayName = displayName || `@root(${Component.displayName})`;

      static propTypes = {
        flux: React.PropTypes.instanceOf(Flux),
      };

      static childContextTypes = {
        [fluxKey]: React.PropTypes.instanceOf(Flux),
      };

      getChildContext() {
        return {
          [fluxKey]: this.props.flux,
        };
      }

      render() {
        return <Component {...this.props} />;
      }
    }

    return RootComponent;
  };
}

export default root;
