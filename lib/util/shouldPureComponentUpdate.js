import shallowEqual from 'shallowequal';

function shouldPureComponentUpdate(nextProps, nextState) {
  return (!shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState));
}

export default shouldPureComponentUpdate;
