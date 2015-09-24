import React from 'react';

import Nexus from '../../..';
const { deps, Store } = Nexus;

export default deps(({ userId }) => ({
  actions: {
    deleteUser: `/users/${userId}/delete`,
  },
  stores: {
    userState: `/users/${userId}`,
  },
}))(class User extends React.Component {
  static displayName = 'User';

  static propTypes = {
    deleteUser: React.PropTypes.func,
    userState: Store.State.propType(React.PropTypes.shape({
      userId: React.PropTypes.string,
      nickname: React.PropTypes.string,
    })),
  };

  render() {
    const { userState } = this.props;
    if(userState.isPending()) {
      return <div className='User pending'>
        {'Loading...'}
      </div>;
    }
    if(userState.isRejected()) {
      return <div className='User rejected'>
        {'Error: '}{userState.reason}
      </div>;
    }
    return <div className='User'>
      {userState.value.nickname}
      <button onClick={() => this.props.deleteUser()}>{'X'}</button>
    </div>;
  }
});
