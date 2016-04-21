import React from 'react';

import { deps, Store } from '../../../';

import User from './User';

export default deps(() => ({
  actions: {
    createUser: `/users/create`,
    toggleUsersVisibility: `/ui/users/toggle/visibility`,
  },
  stores: {
    users: '/users',
    uiUsersVisibility: '/ui/users/visibility',
  },
}))(class Users extends React.Component {
  static displayName = 'Users';

  static propTypes = {
    createUser: React.PropTypes.func,
    optionalStore: Store.State.propType(React.any),
    toggleUsersVisibility: React.PropTypes.func,
    uiUsersVisibility: Store.State.propType(React.PropTypes.bool.isRequired).isRequired,
    users: Store.State.propType(React.PropTypes.arrayOf(React.PropTypes.shape({
      userId: React.PropTypes.number.isRequired,
      userName: React.PropTypes.string.isRequired,
      rank: React.PropTypes.string.isRequired,
    }))).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      inputUserName: '',
      inputRank: '',
    };
  }

  updateInputUserName(ev) {
    const inputUserName = ev.target.value;
    this.setState({ inputUserName });
  }

  updateInputRank(ev) {
    const inputRank = ev.target.value;
    this.setState({ inputRank });
  }

  createUser({ userName, rank }) {
    const { createUser } = this.props;
    createUser({ userName, rank });
    this.setState({
      inputUserName: '',
      inputRank: '',
    });
  }

  render() {
    const { users, uiUsersVisibility } = this.props;
    const { inputUserName, inputRank } = this.state;
    if(users.isPending()) {
      return <div className='Users pending'>
        {'Loading...'}
      </div>;
    }
    if(users.isRejected()) {
      return <div className='Users rejected'>
        {'Error: '}{users.reason}
      </div>;
    }
    const userList = users.value;
    const userListVisibility = uiUsersVisibility.value;
    return <div>
      <div>
        <button
          id='UsersVisibility'
          onClick={() => this.props.toggleUsersVisibility()}>
          {'Show/Hide Users'}
        </button>
      </div>
      { userListVisibility ? <ul className='Users'>{userList.map(({ userName, rank, userId }) =>
        <li key={userId}>
          <User rank={rank} userId={userId} userName={userName} />
        </li>
      )}</ul> : null }
      <input
        id='InputUserName'
        onChange={(ev) => this.updateInputUserName(ev)}
        placeholder={'User Name'}
        value={inputUserName}
      />
      <input
        id='InputUserRank'
        onChange={(ev) => this.updateInputRank(ev)}
        placeholder={'Rank'}
        value={inputRank}
      />
      <button
        id='CreateUser'
        onClick={() => this.createUser({
          userName: inputUserName,
          rank: inputRank,
        })}>
        {'Create New User'}
      </button>
    </div>;
  }
});
