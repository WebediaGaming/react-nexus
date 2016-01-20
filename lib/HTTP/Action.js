import Nexus from '../';
const { util: { creatable } } = Nexus;
import request from './request';

@creatable
class HTTPAction extends Nexus.Action {
  constructor(route, dispatch, urlObj) {
    super(route, dispatch);
    this.urlObj = urlObj;
  }

  async post(pathname, body, opts) {
    return await request('POST', pathname, body, opts, this.urlObj);
  }
}

export default HTTPAction;
