import _ from 'lodash';
import deepEqual from 'deep-equal';

export default function shouldComponentUpdate(nextProps, nextState) {
  return _.any([
    !deepEqual(this.props, nextProps),
    !deepEqual(this.state, nextState),
  ]);
}
