import React from 'react';
import { addons } from 'react/addons';
const { PureRenderMixin } = addons;

import Nexus from './Nexus';

function bindRoot(
    Component,
    createNexus = Component.prototype.createNexus,
    defaultRender = Component.prototype.defaultRender || (() => null),
    displayName = `NexusRoot${Component.displayName}`
  ) {

  if(__DEV__) {
    createNexus.should.be.a.Function;
    displayName.should.be.a.String;
  }

  return class extends React.Component {
    static displayName = displayName;

    static propTypes = {
      data: React.PropTypes.object,
      lifespan: React.PropTypes.object,
      nexus: React.PropTypes.object,
    };

    isReactNexusRootInstance = true;

    getOtherProps() {
      return _.omit(this.props, ['nexus', 'data']);
    }

    getNexus() {
      const { nexus, lifespan } = this;
      return { nexus, lifespan, instance: this };
    }

    componentDidMount() {
      const { nexus } = this.state;
      _.each(nexus, (flux) => flux.stopInjecting());
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
        _.each(nexus, (flux, k) => flux.startInjecting(data[k]));
        Object.assign(this, { nexus, lifespan });
      }
      else {
        Object.assign(this, createNexus.call(this, { data, ...otherProps })); // eslint-disable-line object-shorthand
      }
    }

    render() {
      Nexus.currentNexus = this.nexus;
      return <Component {...this.getOtherProps()} />;
    }
  };
}

export default bindRoot;
