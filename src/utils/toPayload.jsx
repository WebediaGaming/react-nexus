import _ from 'lodash';
import $nexus from '../$nexus';

export default function toPayload(context) {
  if(!_.has(context, $nexus)) {
    return JSON.stringify({});
  }
  return JSON.stringify(_.mapValues(context[$nexus], (flux) => flux.serialize()));
}
