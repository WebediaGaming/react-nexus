import { Lifespan } from 'nexus-flux';
import React from 'react';

function checkBindings(bindings) {
  if(__DEV__) {
    bindings.should.be.an.Object;
    _.each(bindings, ([flux, path, defaultValue]) => {
      flux.should.be.a.String;
      path.should.be.a.String;
      void defaultValue;
    });
  }
}

export default (Nexus) => (Component, getNexusBindings) => class NexusElement extends React.Component {
  constructor(props) {
    if(__DEV__) {
      getNexusBindings.should.be.a.Function;
    }
    super(props);
    this._nexusBindings = {};
    this._nexusBindingsLifespans = {};
    const bindings = getNexusBindings(props);
    checkBindings(bindings);
    this.state = _.mapValues(bindings, ([flux, path, defaultValue]) => {
      if(this.getFlux(flux).isPrefetching) {
        return this.getFlux(flux).prefetch(path);
      }
      if(this.getFlux(flux).isInjecting) {
        return this.getFlux(flux).getInjected(path);
      }
      return defaultValue;
    });
  }

  getNexus() {
    if(__DEV__) {
      (Nexus.currentNexus !== null).should.be.ok;
    }
    return Nexus.currentNexus;
  }

  getFlux(flux) {
    if(__DEV__) {
      this.getNexus().should.have.property(flux);
    }
    return this.getNexus()[flux];
  }

  prefetchNexusBindings() {
    const bindings = getNexusBindings(this.props);
    return Promise.all(_.map(bindings, ([flux, path]) =>
      this.getFlux(flux).isPrefetching ? this.getFlux(flux).prefetch(path) : Promise.resolve())
    ).then(() => this);
  }

  applyNexusBindings(props) {
    const prevBindings = this._nexusBindings || {};
    const prevLifespans = this._nexusBindingsLifespans || {};
    const nextLifespans = {};
    const nextBindings = getNexusBindings(props);

    _.each(_.union(_.keys(prevBindings), _.keys(nextBindings)), (stateKey) => {
      const prev = prevBindings[stateKey];
      const next = nextBindings[stateKey];
      const addNextBinding = () => {
        const [flux, path, defaultValue] = next;
        const lifespan = nextLifespans[stateKey] = new Lifespan();
        this.setState({
          [stateKey]: this.getFlux(flux).getStore(path, lifespan)
            .onUpdate(({ head }) => this.setState({ [stateKey]: head }))
            .onDelete(() => this.setState({ [stateKey]: void 0 }))
          .value || defaultValue,
        });
      };
      const removePrevBinding = () => {
        this.setState({ [stateKey]: void 0 });
        prevLifespans[stateKey].release();
      };
      if(prev === void 0) { // binding is added
        addNextBinding();
        return;
      }
      if(next === void 0) { // binding is removed
        removePrevBinding();
        return;
      }
      const [prevFlux, prevPath] = prev;
      const [nextFlux, nextPath] = next;
      if(prevFlux !== nextFlux || prevPath !== nextPath) { // binding is modified
        removePrevBinding();
        addNextBinding();
      }
      else {
        nextLifespans[stateKey] = this._nexusBindingsLifespans[stateKey];
      }
    });

    this._nexusBindings = nextBindings;
    this._nexusBindingsLifespans = nextLifespans;
  }

  componentDidMount() {
    this.applyNexusBindings(this.props);
  }

  componentWillUnmount() {
    _.each(this._nexusBindingsLifespans || [], (lifespan) => lifespan.release());
  }

  componentWillReceiveProps(nextProps) {
    this.applyNexusBindings(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextProps, nextState);
  }

  render() {
    const props = Object.assign({}, this.props, this.state);
    return <Component {...props} />;
  }
};
