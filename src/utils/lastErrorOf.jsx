import _ from 'lodash';

export default function lastErrorOf(versions) {
  const [err] = _.last(versions);
  return err;
}
