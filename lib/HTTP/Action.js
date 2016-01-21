import url from 'url';

import Action from '../Action';
import creatable from '../util/creatable';

@creatable
class MemoryAction extends Action {
  constructor(route, httpConfig) {
    async function dispatch(q, params) {
      const path = this.toPath(q);
      const { pathname, query } = url.parse(path, false, true);
      const uri = url.format(Object.assign({}, httpConfig, { pathname, query }));
      return await fetch(uri, {
        method: 'POST',
        mode: 'cors',
        headers: Object.assign({}, {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, params.headers),
        body: JSON.stringify(params.body),
      });
    }
    super(route, dispatch);
  }
}

export default MemoryAction;
