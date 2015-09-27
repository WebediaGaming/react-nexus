import _ from 'lodash';

export default function omitChildren(props) {
  return _.omit(props, 'children');
}
