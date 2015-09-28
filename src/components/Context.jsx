import _ from 'lodash';
import deepEqual from 'deep-equal';
import React from 'react';
import should from 'should/as-function';

const __DEV__ = process.env.NODE_ENV === 'development';

import omitChildren from '../utils/omitChildren';
import Flux from '../Flux';

class Context extends React.Component {
  static displayName = 'Nexus.Context';
  static propTypes = {
    children: React.PropTypes.node,
  };
  static contextTypes = {};
  static childContextTypes = {};

  constructor(props, context) {
    super(props, context);
    if(__DEV__) {
      this.validateProps(props);
    }
  }

  validateProps(props) {
    const fluxes = omitChildren(props);
    _.each(fluxes, (flux) => should(flux).be.an.instanceOf(Flux));
  }

  getChildContext() {
    const fluxes = omitChildren(this.props);
    return Object.assign({}, this.context, fluxes);
  }

  componentWillReceiveProps(nextProps) {
    this.validateProps(nextProps);
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }

  render() {
    return this.props.children;
  }
}

export default Context;
