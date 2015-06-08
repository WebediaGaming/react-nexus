import React from 'react';
import { component } from '../';
import transform from 'react-transform-props';

@component(() => ({
  users: ['local://users', {}],
}))
@component(({ users }) =>
  users.mapEntries(([userId]) =>
    [`user:${userId}`, [`local://users/${userId}`, { firstName: 'John', lastName: 'Doe' }]]
  ).toObject())
@transform((props) => _(props)
  .pairs()
  .filter(([k]) => k.substring(0, 'user:'.length) === 'user:')
  .map(([k, v]) => [k.substring('user:'.length), v])
  .object()
.value())
class Users extends React.Component {
  static displayName = 'Users';

  render() {
    return <ul>
      {_.map(this.props, (user, key) => <li key={key}>
        {user.get('firstName')} {user.get('lastName')}
      </li>)}
    </ul>;
  }
}

export default Users;
