import Nexus from '../';
const { util: { creatable } } = Nexus;

@creatable
class MemoryAction extends Nexus.Action {
  constructor(route, dispatch) {
    super({
      dispatch,
      route,
    });
  }
}

export default MemoryAction;
