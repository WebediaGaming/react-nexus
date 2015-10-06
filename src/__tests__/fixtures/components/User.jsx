import React from 'react';
import { T, propType, schemas } from '../types';

import { inject, pure, isPending, lastErrorOf, lastValueOf, LocalFlux, HTTPFlux } from '../../../';

// Helper components

function Users({ users }) {
  if(isPending(users)) {
    return <p>Loading users...</p>;
  }
  const [err, val] = [lastErrorOf(users), lastValueOf(users)];
  if(err) {
    return <p>{err.toString()}</p>;
  }
  return <p>Total users: {val.items.length}</p>;
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

@inject(({ local }) => ({
  authToken: local.get('/authToken'),
  fontSize: local.get('/fontSize'),
}))
@inject(({ http, local }, { userId, authToken }) => ({
  error: http.get('/error'),
  http,
  local,
  me: http.get(`/me`, { query: { authToken: lastValueOf(authToken) } }),
  user: http.get(`/users/${userId}`),
  users: http.get(`/users`),
}))
@pure
export default class User extends React.Component {
  static displayName = 'User';
  static propTypes = {
    authToken: propType(T.String()),
    fontSize: propType(T.oneOf(T.String(), T.Number())),
    http: React.PropTypes.instanceOf(HTTPFlux),
    local: React.PropTypes.instanceOf(LocalFlux),
    me: propType(schemas.user),
    user: propType(schemas.user),
    userId: React.PropTypes.string.isRequired,
    users: propType(T.shape({ items: T.Array({ type: schemas.user }) })),
  };

  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.refreshUsers = null;
  }

  componentDidMount() {
    const { http } = this.props;
    this.refreshUsers = setInterval(() => http.dispatch('refresh users'), 5000);
  }

  componentWillUnmount() {
    if(this.refreshUsers !== null) {
      clearInterval(this.refreshUsers);
    }
  }

  followUser() {
    const { userId, authToken, http } = this.props;
    this.setState({
      following: http.dispatch('follow user', {
        userId: lastValueOf(userId),
        authToken: lastValueOf(authToken),
      }),
    });
  }

  updateFontSize(e) {
    e.preventDefault();
    const { local } = this.props;
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
