import _ from 'lodash';

export default function toPayload(nexus) {
  return JSON.stringify(_.mapValues(nexus, (flux) => flux.serialize()));
}
