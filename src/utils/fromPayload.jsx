import _ from 'lodash';

export default function fromPayload(json, Fluxes) {
  return _.mapValues(JSON.parse(json), (serialized, key) => Fluxes[key].unserialize(serialized));
}
