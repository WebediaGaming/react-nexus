import _ from 'lodash';
import should from 'should/as-function';

import Flux from '../fluxes/Flux';

export default function validateNexus(props, key) {
  try {
    const nexus = props[key];
    should(nexus).be.an.Object();
    _.each(nexus, (flux) => should(flux).be.an.instanceOf(Flux));
  }
  catch(err) {
    return err;
  }
}
