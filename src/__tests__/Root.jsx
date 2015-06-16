import React from 'react';
import LocalFlux from 'nexus-flux/adapters/local';
import Nexus from '../';
const { Lifespan, Remutable } = Nexus;

import User from './User';
import Users from './Users';

@Nexus.root(({ data, path }) => {
  const lifespan = new Lifespan();
  const recover = (key, defaultValue) => data && data[key] || defaultValue;
  const localStores = {
    '/session': new Remutable(recover('/session', { userId: 1 })),
    '/route': new Remutable({ path }),
    '/users': new Remutable({ '1': 1, '2': 2 }),
    '/users/1': new Remutable(recover('/users/1', { firstName: 'Immanuel', lastName: 'Kant' })),
    '/users/2': new Remutable(recover('/users/2', { firstName: 'Friedrich', lastName: 'Nietzsche' })),
  };

  const localServer = new LocalFlux.Server(localStores);
  const localClient = new LocalFlux.Client(localServer);
  lifespan.onRelease(() => {
    localServer.lifespan.release();
    localClient.lifespan.release();
  });

  const nexus = { local: localClient };
  return { lifespan, nexus };
})
@Nexus.component(() => ({
  route: ['local://route', { path: 'default' }],
  session: ['local://session', {}],
}))
class Root extends React.Component {
  static displayName = 'Root';

  static propTypes = {
    route: Nexus.PropTypes.Immutable.Map,
    session: Nexus.PropTypes.Immutable.Map,
  };

  render() {
    const { route, session } = this.props;
    const path = route.get('path');
    const userId = session.get('userId');
    return <div className='Root'>
      <p>Route is {path || null}. User is {userId ? <User userId={userId} /> : null}.</p>
      <Users />
    </div>;
  }
}

export default Root;
