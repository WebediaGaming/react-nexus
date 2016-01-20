import React from 'react';

import Nexus from '../../..';
const { stores, Store } = Nexus;

@stores(({ userId }) => ({
  userState: `/users/${userId}`,
}))
class User extends React.Component {
  static displayName = 'User';
  static propTypes = {
    userState: Store.State.propType(React.PropTypes.shape({
      userId: React.PropTypes.string,
      nickname: React.PropTypes.string,
    })),
  };
  render() {
    const { userState } = this.props;
    if(userState.isPending()) {
      return <div>
        {'Loading...'}
      </div>;
    }
    if(userState.isRejected()) {
      return <div>
        {'Error:'}{userState.reason}
      </div>;
    }
    return <div>
      {userState.value.nickname}
    </div>;
  }
}

export default User;
