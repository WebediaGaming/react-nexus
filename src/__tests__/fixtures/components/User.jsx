import _ from 'lodash';
import React from 'react';
import T from 'typecheck-decorator';

import { multiInject, pure } from '../../../';

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

@multiInject(({ userId }, { http }) => ({
  me: http.get(`/me`, { query: { authToken: 'E47Exd7RdDds' } }),
  user: http.get(`/users/${userId}`),
  users: http.get(`/users`, { refreshEvery: 5000 }),
  error: http.get('/error'),
}))
@pure
export default class extends React.Component {
  static displayName = 'User';
  static propTypes = {
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
    const { userId } = this.props;
    const { http, local } = this.context;
    this.setState({
      following: http.dispatch('followUser', {
        userId,
        authToken: _.last(local.versions('/authToken')),
      }),
    });
  }

  render() {
    return <div>
      {([err, users]) => {
        if(!err && !users) {
          return <p>Loading users...</p>;
        }
        if(err) {
          return <p>{err.toString()}</p>;
        }
        return <p>Total users: {users.length}</p>;
      }(_.last(this.props.users))}
      {([err, user]) => {
        if(!err && !user) {
          return <p>Loading user...</p>;
        }
        if(err) {
          return <p>{err.toString()}</p>;
        }
        const { userName, profilePicture } = user;
        return <p>
          Username {userName} <img src={profilePicture} />
          {({ following }) => {
            if(!following || following.isPending()) {
              return <button onClick={() => this.followUser()} disabled={following && following.isPending()}>
                Follow user
              </button>;
            }
            if(following.isRejected()) {
              return <p>{following.reason().toString()}</p>;
            }
            return <p>{following.value().toString()}</p>;
          }(this.state)}
        </p>;
      }(_.last(this.props.user))}
    </div>;
  }
}
