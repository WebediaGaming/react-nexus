import React from 'react';
import Lifespan from 'lifespan';
import Nexus from '../';

const Mixin = {

  _nexusBindingsLifespan: null,
  _lifespan: null,

  get nexus() {
    if(__DEV__) {
      (Nexus.currentNexus !== null).should.be.true;
    }
    return Nexus.currentNexus;
  }

  get lifespan() {
    if(!this._lifespan) {
      this._lifespan = new Lifespan();
    }
    return this._lifespan;
  },

  getInitialState() {
    const bindings = this.getNexusBindings(this.props);
    const state = {};
    _.each(bindings, ([flux, path], stateKey) => {
      if(flux.isInjecting) {
        state[stateKey] = flux.inject(path); // will return the immutable head
      }
      else {
        state[stateKey] = null;
      }
    });
    return state;
  }

  getNexusBindings(props = {}) {
    if(__DEV__) {
      props.should.be.an.Object;
    }
    return {};
  },

  prefetchNexusBindings() {
    const prefetchedState = {};
    const bindings = this.getNexusBindings();
    return Promise.all(_.map(bindings, ([flux, path], stateKey) => {
      if(flux.isPrefetching) {
        return flux.prefetch(path);
      }
      return Promise.resolve();
    }))
    .then(() => this); // return this to be chainable
  },

  applyNexusBindings(props) {
    const previousBindingsLifespan = this._nexusBindingsLifespan;
    this._nexusBindingsLifespan = new Lifespan();
    const bindings = this.getNexusBindings(props);
    _.each(bindings, ([flux, path], stateKey) => this.setState({
      [stateKey]: flux.Store(path, this._nexusBindingsLifespan)
        .onUpdate((head) => this.setState({ [stateKey]: head }))
        .onDelete(() => this.setState({ [stateKey]: void 0 }))
        .value, // will also return the immutable head
    });
    if(previousBindingsLifespan) {
      previousBindingsLifespan.release();
    }
  },

  componentWillMount() {
    this.lifespan.onRelease(() => {
      if(this._nexusBindingsLifespan) {
        this._nexusBindingsLifespan.release();
      }
    });
    this.applyNexusBindings(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.applyNexusBindings(nextProps);
  },

  componentWillUnmount() {
    this.lifespan.release();
  },
};



export default Mixin;
