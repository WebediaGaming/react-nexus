import _ from 'lodash';
import React from 'react';
import T from 'typecheck-decorator';

import { multiInject, pure } from '../../';

function propType(schema) {
  return T.toPropType(T.shape([
    T.bool(), // pending
    T.option(T.oneOf(T.exactly(null), T.Error())), // err
    T.option(schema), // res
  ]));
}

const userSchema = T.shape({
  userId: T.String(),
  userName: T.String(),
  profilePicture: T.String(),
});

@multiInject(({ userId }, { http, local }) => ({
  me: http.get(`/me`, {
    query: { authToken: _.last(local.values('/authToken')) },
  }),
  user: http.get(`/users/${userId}`),
  users: http.get(`/users`, { refreshEvery: 600000 }),
}))
@pure
export default class extends React.Component {
  static displayName = 'User';
  static propTypes = {
    me: propType(userSchema),
    user: propType(userSchema),
    userId: React.PropTypes.number.isRequired,
    users: propType(T.Array(userSchema)),
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
        authToken: _.last(local.values('/authToken')),
      }),
    });
  }

  render() {
    return <div>
      {(pending, err, users) => {
        if(pending) {
          return <p>Loading users...</p>;
        }
        if(err) {
          return <p>{err.toString()}</p>;
        }
        return <p>Total users: {users.length}</p>;
      }(...this.props.users)}
      {(pending, err, user) => {
        if(pending) {
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
              return <button onClick={() => this.followUser()} disabled={following.isPending()}>Follow user</button>;
            }
            if(following.isRejected()) {
              return <p>{following.reason().toString()}</p>;
            }
            return <p>{following.value().toString()}</p>;
          }(this.state)}
        </p>;
      }(...this.props.user)}
    </div>;
  }
}
