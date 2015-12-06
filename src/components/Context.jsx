import _ from 'lodash';
import deepEqual from 'deep-equal';
import React from 'react';
import should from 'should/as-function';

const __DEV__ = process.env.NODE_ENV === 'development';

import $nexus from '../$nexus';
import Flux from '../fluxes/Flux';
import validateNexus from '../utils/validateNexus';

class Context extends React.Component {
  static displayName = 'Nexus.Context';
  static propTypes = {
    children: React.PropTypes.node,
  };
  static childContextTypes = {
    [$nexus]: validateNexus,
  };

  constructor(props, context) {
    super(props, context);
    if(__DEV__) {
      this.validateProps(props);
    }
  }

  getChildContext() {
    const { props, context } = this;
    const { children, ...nexus } = props;
    return {
      [$nexus]: Object.assign({}, nexus, context[$nexus] || {}),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.validateProps(nextProps);
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }

  validateProps(props) {
    const { children, ...nexus } = props;
    _.each(nexus, (flux) => should(flux).be.an.instanceOf(Flux));
  }

  render() {
    return this.props.children;
  }
}

export default Context;
