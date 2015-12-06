import Promise from 'bluebird';

import HTTPFlux from '../../../fluxes/HTTPFlux';

class CustomHTTPFlux extends HTTPFlux {
  static displayName = 'CustomHTTPFlux';

  dispatch(type, payload) {
    return Promise.try(() => {
      if(type === 'follow user') {
        const { authToken, userId } = payload;
        return this.request(`/users/${userId}/follow`, 'post', { query: { authToken } });
      }
      if(type === 'refresh users') {
        return this.get('/users').update();
      }
      throw new TypeError(`Unknown action type '${type}' for '${this.constructor.displayName}'.`);
    });
  }
}

export default CustomHTTPFlux;
