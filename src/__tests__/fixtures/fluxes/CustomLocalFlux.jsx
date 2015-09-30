import T, { takes as devTakes, returns as devReturns } from 'typecheck-decorator';
import Promise from 'bluebird';

import LocalFlux from '../../../fluxes/LocalFlux';

class CustomLocalFlux extends LocalFlux {
  static displayName = 'CustomLocalFlux';

  @devTakes(T.String(), T.option(T.Object()))
  @devReturns(T.Promise())
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
