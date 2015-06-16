import React from 'react';
import Nexus from '../';

@Nexus.component(({ userId }) => ({
  user: [`local://users/${userId}`, { firstName: 'John', lastName: 'Doe' }],
}))
class User extends React.Component {
  static displayName = 'User';

  static propTypes = {
    user: Nexus.PropTypes.Immutable.Map,
  }

  render() {
    const { user } = this.props;
    const firstName = user.get('firstName');
    const lastName = user.get('lastName');
    return <span>
      {lastName}. {firstName} {lastName}
    </span>;
  }
}

export default User;
