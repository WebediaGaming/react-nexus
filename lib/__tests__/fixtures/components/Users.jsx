import React from 'react';

import Nexus from '../../..';
const { stores, Store } = Nexus;

import User from './User';

export default stores(() => ({
  usersState: '/users',
}))(class Users extends React.Component {
  static displayName = 'Users';

  static propTypes = {
    usersState: Store.State.propType(React.PropTypes.objectOf(React.PropTypes.string)),
  };

  render() {
    const { usersState } = this.props;
    if(usersState.isPending()) {
      return <div className='Users pending'>
        {'Loading...'}
      </div>;
    }
    if(usersState.isRejected()) {
      return <div className='Users rejected'>
        {'Error: '}{usersState.reason}
      </div>;
    }
    return <ul className='Users'>{Object.keys(usersState.value).map((userId) =>
      <li key={userId}>
        <User userId={userId} />
      </li>
    )}</ul>;
  }
});
