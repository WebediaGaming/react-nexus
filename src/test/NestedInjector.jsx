import React from 'react';
import Nexus from '../';

export default class extends React.Component {
  static displayName = 'NestedInjector';
  static propTypes = {
    etc: Nexus.PropTypes.Immutable.Map,
  };
  render() {
    return <div className='NestedInjector'>etc = foo: {this.props.etc.get('foo')}</div>;
  }
}
