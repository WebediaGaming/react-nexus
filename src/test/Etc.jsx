import React from 'react';
import Nexus from '../';

export default class extends React.Component {
  static displayName = 'Etc';
  static propTypes = {
    etc: Nexus.PropTypes.Immutable.Map,
  };
  render() {
    return <div className='Etc'>etc = foo: {this.props.etc.get('foo')}</div>;
  }
}
