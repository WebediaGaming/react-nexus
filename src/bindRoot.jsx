import React from 'react';
import pure from 'pure-render-decorator';
import _ from 'lodash';
import should from 'should';

const __DEV__ = process.env.NODE_ENV === 'development';

import { $isRootInstance } from './symbols';

function bindRoot(
    Component,
    createNexus = Component.prototype.createNexus,
    defaultRender = Component.prototype.defaultRender || (() => null),
    displayName = `NexusRoot${Component.displayName}`
) {

  if(__DEV__) {
    should(createNexus).be.a.Function;
    should(displayName).be.a.String;
  }

  const NexusRoot = @pure class extends React.Component {
    static displayName = displayName;

    static childContextTypes = {
      nexus: React.PropTypes.object.isRequired,
    };

    static propTypes = {
      data: React.PropTypes.object,
      lifespan: React.PropTypes.object,
      nexus: React.PropTypes.object,
    };

    getOtherProps() {
      return _.omit(this.props, ['nexus', 'data']);
    }

    getChildContext() {
      const { nexus } = this;
      return {
        nexus,
      };
    }

    getNexus() {
      const { nexus, lifespan } = this;
      return { nexus, lifespan, instance: this };
    }

    startInjecting(data) {
      const { nexus } = this;
      if(data !== null) {
        _.each(data, (i, k) => {
          if(nexus[k]) {
            nexus[k].startInjecting(i);
          }
        });
      }
    }

    stopInjecting() {
      const { nexus } = this;
      const { data } = this.props;
      if(data !== null) {
        _.each(data, (i, k) => {
          if(nexus[k]) {
            nexus[k].stopInjecting();
          }
        });
      }
    }

    componentDidMount() {
      this.stopInjecting();
    }

    componentWillUnmount() {
      this.lifespan.release();
    }

    constructor({
      nexus = null,
      lifespan = null,
      data = null,
      ...otherProps, // eslint-disable-line object-shorthand
    }) {
      super(otherProps);
      if(nexus !== null) {
        Object.assign(this, { nexus, lifespan });
      }
      else {
        Object.assign(this, createNexus.call(this, { data, ...otherProps })); // eslint-disable-line object-shorthand
      }
      this.startInjecting(data);
    }

    render() {
      return <Component {...this.getOtherProps()} />;
    }
  };

  Object.assign(NexusRoot.prototype, {
    [$isRootInstance]: true,
  });

  return NexusRoot;
}

export default bindRoot;
