import React from 'react';

import Nexus from '../../../';
const { deps } = Nexus;

export default deps(({ userId }) => ({
  actions: {
    deleteUser: `/users/${userId}/delete`,
    updateUser: `/users/${userId}/update`,
  },
}))(class User extends React.Component {
  static displayName = 'User';

  static propTypes = {
    deleteUser: React.PropTypes.func,
    rank: React.PropTypes.string,
    updateUser: React.PropTypes.func,
    userId: React.PropTypes.number,
    userName: React.PropTypes.string,
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

  updateUser({ userName, rank }) {
    const { updateUser } = this.props;
    updateUser({ userName, rank });
    this.setState({
      inputUserName: '',
      inputRank: '',
    });
  }

  render() {
    const { userId, userName, rank } = this.props;
    const { inputUserName, inputRank } = this.state;
    return <div className='User'>
      <div className='UserId'>{`User #${userId}`}</div>
      <div className='UserName'>{`User Name: ${userName}`}</div>
      <div className='UserRank'>{`User Rank: ${rank}`}</div>
      <button onClick={() => this.props.deleteUser()}>{'X'}</button>
      <div>
        <input
          id={`InputUserName-${userId}`}
          onChange={(ev) => this.updateInputUserName(ev)}
          placeholder={'Updated Name'}
          value={inputUserName}
        />
        <input
          id={`InputUserRank-${userId}`}
          onChange={(ev) => this.updateInputRank(ev)}
          placeholder={'Updated Rank'}
          value={inputRank}
        />
        <button onClick={() => this.updateUser({
          userName: inputUserName,
          rank: inputRank,
        })}>{'Update'}</button>
      </div>
    </div>;
  }
});
