import React from 'react';
import T from 'typecheck-decorator';

import { inject, multiInject, pure, isPending, lastErrorOf, lastValueOf, getNexusOf } from '../../../';

// Helper components

function Users({ users }) {
  if(isPending(users)) {
    return <p>Loading users...</p>;
  }
  const [err, val] = [lastErrorOf(users), lastValueOf(users)];
  if(err) {
    return <p>{err.toString()}</p>;
  }
  return <p>Total users: {val.length}</p>;
}

function UserProfile({ user, following, followUser }) {
  if(isPending(user)) {
    return <p>Loading user...</p>;
  }
  const [err, val] = [lastErrorOf(user), lastValueOf(user)];
  if(err) {
    return <p>{err.toString()}</p>;
  }
  const { userName, profilePicture } = val;
  return <p>
    Username {userName} <img src={profilePicture} />
    <FollowButton following={following} onClick={followUser} />
  </p>;
}

function FollowButton({ following, onClick }) {
  if(!following || following.isPending()) {
    return <button onClick={onClick} disabled={following && following.isPending()}>
      Follow user
    </button>;
  }
  if(following.isRejected()) {
    return <p>{following.reason().toString()}</p>;
  }
  return <p>{following.value().toString()}</p>;
}

function propType(schema) {
  return T.toPropType(T.Array(T.shape([
    T.option(T.oneOf(T.exactly(null), T.Error())), // err
    T.option(schema), // res
  ])));
}

const userSchema = T.shape({
  userId: T.String(),
  userName: T.String(),
  profilePicture: T.String(),
});

@inject('authToken', (props, { local }) => local.get('/authToken'))
@multiInject(({ userId, authToken }, { http, local }) => ({
  authToken: local.get('/authToken'),
  error: http.get('/error'),
  fontSize: local.get('/fontSize'),
  me: http.get(`/me`, { query: { authToken: lastValueOf(authToken) } }),
  user: http.get(`/users/${userId}`),
  users: http.get(`/users`, { refreshEvery: 5000 }),
}))
@pure
export default class User extends React.Component {
  static displayName = 'User';
  static propTypes = {
    authToken: propType(T.String()),
    fontSize: propType(T.oneOf(T.String(), T.Number())),
    me: propType(userSchema),
    user: propType(userSchema),
    userId: React.PropTypes.string.isRequired,
    users: propType(T.Array({ type: userSchema })),
  };

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  followUser() {
    const { userId, authToken } = this.props;
    const { http } = getNexusOf(this);
    this.setState({
      following: http.dispatch('follow user', {
        userId: lastValueOf(userId),
        authToken: lastValueOf(authToken),
      }),
    });
  }

  updateFontSize(e) {
    e.preventDefault();
    const { local } = getNexusOf(this);
    local.dispatch('set font size', { fontSize: e.target.value });
  }

  render() {
    const { fontSize, users, user } = this.props;
    const { following } = this.state;
    return <div style={{ fontSize: lastValueOf(fontSize) }}>
      <Users users={users} />
      <UserProfile user={user} following={following} followUser={() => this.followUser()} />
      <div>modify font size:
        <input type='text' onChange={(e) => this.updateFontSize(e)} value={lastValueOf(fontSize)} />
      </div>
    </div>;
  }
}
