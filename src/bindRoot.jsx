import React from 'react';
import { addons } from 'react/addons';
import pure from 'pure-render-decorator';
const { PureRenderMixin } = addons;
const __DEV__ = process.env.NODE_ENV === 'development';
import _ from 'lodash';

import Nexus from './Nexus';
import createBoundComponent from './createBoundComponent';

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

  return @pure class extends React.Component {
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

    createComponent() {
      const { nexus } = this;
      this.Component = class extends Component {
        render() {
          Nexus.currentNexus = nexus;
          return super.render();
        }
      };
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
      this.BoundComponent = createBoundComponent(this, Component);
      this.startInjecting(data);
    }

    render() {
      Nexus.currentNexus = this.nexus;
      const { BoundComponent } = this;
      return <BoundComponent {...this.getOtherProps()} />;
    }
  };
}

export default bindRoot;
