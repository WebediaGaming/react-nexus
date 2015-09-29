import _ from 'lodash';

export default function lastValueOf(versions) {
  const [, val] = _.last(versions);
  return val;
}
