import Nexus from '../';
const { util: { creatable } } = Nexus;

@creatable
class MemoryAction extends Nexus.Action {
  constructor(dispatch) {
    super({ dispatch });
  }
}

export default MemoryAction;
