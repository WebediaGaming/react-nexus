import fetch from 'isomorphic-fetch';

import Nexus from '../';
const { util: { creatable } } = Nexus;

@creatable
class HTTPAction extends Nexus.Action {
}

export default HTTPAction;
