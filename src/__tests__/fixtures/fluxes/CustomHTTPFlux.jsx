import T, { takes as devTakes, returns as devReturns } from 'typecheck-decorator';

import HTTPFlux from '../../../fluxes/HTTPFlux';
import { action as actionType } from '../../../utils/types';

class CustomHTTPFlux extends HTTPFlux {
  static displayName = 'CustomHTTPFlux';

  @devTakes(actionType)
  @devReturns(T.Promise())
  dispatch({ type, payload }) {
    if(type === 'follow user') {
      const { authToken, userId } = payload;
      return this.post(`/users/${userId}/follow`, { query: { authToken } });
    }
    return Promise.reject(new TypeError(`Unknown action type '${type}' for '${this.constructor.displayName}'.`));
  }
}

export default CustomHTTPFlux;
