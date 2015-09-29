import _ from 'lodash';
import deepEqual from 'deep-equal';
import React from 'react';
import should from 'should/as-function';

const __DEV__ = process.env.NODE_ENV === 'development';

import $nexus from '../$nexus';
import Flux from '../fluxes/Flux';
import omitChildren from '../utils/omitChildren';
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

  validateProps(props) {
    const nexus = omitChildren(props);
    _.each(nexus, (flux) => should(flux).be.an.instanceOf(Flux));
  }

  getChildContext() {
    const { props, context } = this;
    const nexus = omitChildren(props);
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

  render() {
    return this.props.children;
  }
}

export default Context;
