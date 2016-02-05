import React from 'react';

import Flux from './Flux';
import defaultFluxKey from './defaultFluxKey';

/**
 * Defines a function that returns a React Component.
 * This React Component will use the React's "context" feature.
 * This feature lets to pass data through the component tree,
 * without having to pass the props down manually at every level.
 *
 * @param {Object} config Defines the object that handle `fluxKey` and `displayName`.
 * @param {String} config.fluxKey The key to retrieve the flux with React's "context".
 * @param {String} config.displayName The displayName of the component.
 * @return {Function} The function that will define the component with the React's "context".
 */
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
