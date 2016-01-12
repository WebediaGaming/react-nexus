import Action from '../Action';
import creatable from '../util/creatable';

@creatable
class MemoryAction extends Action {
  constructor(route, dispatch) {
    super({
      dispatch,
      route,
    });
  }
}

export default MemoryAction;
