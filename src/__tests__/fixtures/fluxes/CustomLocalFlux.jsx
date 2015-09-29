import T, { takes as devTakes, returns as devReturns } from 'typecheck-decorator';

import LocalFlux from '../../../fluxes/LocalFlux';
import { action as actionType } from '../../../utils/types';

class CustomLocalFlux extends LocalFlux {
  static displayName = 'CustomLocalFlux';

  @devTakes(actionType)
  @devReturns(T.Promise())
  dispatch({ type, payload }) {
    if(type === 'set font size') {
      const { fontSize } = payload;
      this.set('/fontSize', fontSize);
      return Promise.resolve();
    }
    return Promise.reject(new TypeError(`Unknown action type '${type}' for '${this.constructor.displayName}'.`));
  }
}

export default CustomLocalFlux;
