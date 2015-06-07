import React from 'react';

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

    createAndRegisterNexus({ data, ...otherProps }) { // eslint-disable-line object-shorthand
      const promise = createNexus.call(this, { data, ...otherProps }) // eslint-disable-line object-shorthand
      .then(({ nexus, lifespan }) => {
        return { nexus, lifespan, instance: this };
      });
      promise.then(({ nexus }) => this.setNexus(nexus));
      return promise;
    }

    setNexus(nexus) {
      Nexus.currentNexus = nexus;
      const { mounted } = this.state;
      if(!mounted) {
        Object.assign(this.state, { nexus });
      }
      else {
        _.each(nexus, (flux, k) => flux.startInjecting(this.props.data[k]));
        this.setState({ nexus }, () => _.each(nexus, (flux) => flux.stopInjecting()));
      }
    }

    componentDidMount() {
      this.setState({ mounted: true });
    }

    waitForNexus() {
      return this.state.promiseForNexus
      .then(({ nexus, lifespan }) => ({ nexus, lifespan, instance: this }));
    }

    constructor({ nexus = null, lifespan = null, data = null, ...otherProps }) { // eslint-disable-line
      super(otherProps);
      this.state = { mounted: false, nexus };
      // nexus and lifespan should either be both null or none is null
      if(nexus !== null) {
        if(__DEV__) {
          (lifespan !== null).should.be.true;
        }
        this.state.promiseForNexus = Promise.resolve({ nexus, lifespan, instance: this });
      }
      else {
        if(__DEV__) {
          (lifespan === null).should.be.true;
        }
        this.state.promiseForNexus = this.createAndRegisterNexus({ data, ...otherProps }); // eslint-disable-line
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      // prevent re-rendering on the client while nexus is null
      if(__BROWSER__ && nextState.nexus === null) {
        return false;
      }
      return React.PureRenderMixin.shouldComponentUpdate.call(this, nextProps, nextState);
    }

    render() {
      const { nexus } = this.state;
      const otherProps = this.getOtherProps();
      if(nexus === null) {
        // apply defaultRender to a fake, non-constructed instance of Component with the same props
        return defaultRender.call(Object.create(Component.prototype, { props: otherProps }));
      }
      return <Component {...otherProps} />;
    }
  };
}

export default bindRoot;
