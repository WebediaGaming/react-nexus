import T, { takes as devTakes, returns as devReturns } from 'typecheck-decorator';

import LocalFlux from '../../../fluxes/LocalFlux';
import { action as actionType } from '../../../utils/types';

class CustomLocalFlux extends LocalFlux {
  static displayName = 'CustomLocalFlux';

  @devTakes(actionType)
  @devReturns(T.Promise())
  dispatch({ type, payload }) {
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
