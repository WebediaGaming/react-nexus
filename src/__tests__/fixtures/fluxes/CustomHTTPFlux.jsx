import T, { takes as devTakes, returns as devReturns } from 'typecheck-decorator';
import Promise from 'bluebird';

import HTTPFlux from '../../../fluxes/HTTPFlux';

class CustomHTTPFlux extends HTTPFlux {
  static displayName = 'CustomHTTPFlux';

  @devTakes(T.String(), T.option(T.Object()))
  @devReturns(T.Promise())
  dispatch(type, payload) {
    return Promise.try(() => {
      if(type === 'follow user') {
        const { authToken, userId } = payload;
        return this.request(`/users/${userId}/follow`, 'post', { query: { authToken } });
      }
      throw new TypeError(`Unknown action type '${type}' for '${this.constructor.displayName}'.`);
    });
  }
}

export default CustomHTTPFlux;
