import React from 'react';

import Nexus from '../../..';
const { actions, stores, Store } = Nexus;

export default
actions(({ userId }) => ({
  deleteUser: `/users/${userId}/delete',`
}))(
  stores(({ userId }) => ({
    userState: `/users/${userId}`,
  }))(class User extends React.Component {
    static displayName = 'User';

    static propTypes = {
      userState: Store.State.propType(React.PropTypes.shape({
        userId: React.PropTypes.string,
        nickname: React.PropTypes.string,
      })),
      deleteUser: React.PropTypes.func,
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
  })
);
