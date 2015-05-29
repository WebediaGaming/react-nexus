import React from 'react';
import bind from './bind';

export default bind(class Injector extends React.Component {
  static propTypes = {
    children: React.PropTypes.element.isRequired,
  }

  render() {
    return React.cloneElement(this.props.children, _.omit(this.props, 'children'));
  }
}, (props) => _.omit(props, 'children'));
