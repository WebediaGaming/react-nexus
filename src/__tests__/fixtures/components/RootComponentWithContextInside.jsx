import React from 'react';
import { T, propType, schemas } from '../types';
import CustomHTTPFlux from '../fluxes/CustomHTTPFlux';
import { Context, inject, isPending, lastValueOf } from '../../../';

@inject(({ http }) => ({
  users: http.get('/users'),
}))
class UserList extends React.Component {
  static displayName = 'UserList';
  static propTypes = {
    users: propType(T.Array({ type: schemas.user })),
  }
  render() {
    const { users } = this.props;
    return (
      <div>
        {isPending(users) ? 'loading...' : lastValueOf(users).map((user) => user.userName).join()}
      </div>
    );
  }
}

class RootComponentWithContextInside extends React.Component {
  static displayName = 'RootComponentWithContextInside';
  constructor(...args) {
    super(...args);
    this.nexus = {
      http: new CustomHTTPFlux('http://127.0.0.1:8888'),
    };
  }
  render() {
    return (
      <Context {...this.nexus}>
        <UserList />
      </Context>
    );
  }
}

export default RootComponentWithContextInside;
