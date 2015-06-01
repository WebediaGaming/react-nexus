import React from 'react';
import Nexus from './Nexus';
import Immutable from 'immutable';
const { Lifespan, checkBindings, STATUS } = Nexus;

function bind(
    Component,
    getNexusBindings = Component.prototype.getNexusBindings,
    displayName = `Nexus${Component.displayName}`
  ) {
  if(__DEV__) {
    Component.should.be.a.Function;
    getNexusBindings.should.be.a.Function;
    displayName.should.be.a.String;
  }
  return class extends React.Component {
    static displayName = displayName;
    isReactNexusComponentInstance = true;

    _nexusBindings = null;
    _nexusBindingsLifespans = null;
    state = null;

    constructor(props) {
      super(props);
      this._nexusBindings = {};
      this._nexusBindingsLifespans = {};
      const bindings = getNexusBindings(props);
      checkBindings(bindings);
      this.state = _.mapValues(bindings, ([flux, path, defaultValue]) => {
        if(this.getFlux(flux).isPrefetching) {
          return [STATUS.PREFETCH, this.getFlux(flux).prefetch(path).promise];
        }
        if(this.getFlux(flux).isInjecting) {
          return [STATUS.INJECT, this.getFlux(flux).getInjected(path)];
        }
        return [STATUS.PENDING, Immutable.Map(defaultValue)];
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

    getCurrentValue(key) {
      if(__DEV__) {
        key.should.be.a.String;
        this.state.should.have.property(key);
      }
    }

    getDataMap() {
      return _.mapValues(this.state, ([status, value]) => {
        // in this case only, the value is wrapped
        if(status === STATUS.PREFETCH) {
          return value.value();
        }
        // in all other cases (INJECT, PENDING, LIVE, SYNCING) then the value is unwrapped
        return value;
      });
    }

    waitForPrefetching() {
      return Promise.all(_.map(this.state, ([status, promise]) =>
        status === STATUS.PREFETCH ? promise : Promise.resolve()
      ));
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
          const store = this.getFlux(flux).getStore(path, lifespan)
            .onUpdate(({ head }) => this.setState({ [stateKey]: [STATUS.LIVE, head] }))
            .onDelete(() => this.setState({ [stateKey]: void 0 }));
          this.setState({ [stateKey]: [STATUS.SYNCING, store.value || Immutable.Map(defaultValue)] });
        };
        const removePrevBinding = () => {
          this.setState({ [stateKey]: void 0 });
          prevLifespans[stateKey].release();
        };
        const [status] = this.state[stateKey];
        // binding is added/synced
        if(prev === void 0 || status === STATUS.PENDING) {
          addNextBinding();
          return;
        }
        // binding is removed
        if(next === void 0) {
          removePrevBinding();
          return;
        }
        const [prevFlux, prevPath] = prev;
        const [nextFlux, nextPath] = next;
        // binding is modified
        if(prevFlux !== nextFlux || prevPath !== nextPath) {
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
      const nexusContext = { nexus: this.getNexus() };
      const dataMap = this.getDataMap();
      const { props } = this;
      const childProps = Object.assign({}, nexusContext, props, dataMap);
      return <Component {...childProps} />;
    }
  };
}

export default bind;
