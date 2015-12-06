import Promise from 'bluebird';

import LocalFlux from '../../../fluxes/LocalFlux';

class CustomLocalFlux extends LocalFlux {
  static displayName = 'CustomLocalFlux';

  dispatch(type, payload) {
    return Promise.try(() => {
      if(type === 'set font size') {
        const { fontSize } = payload;
        return this.set('/fontSize', fontSize);
      }
      throw new TypeError(`Unknown action type '${type}' for '${this.constructor.displayName}'.`);
    });
  }
}

export default CustomLocalFlux;
