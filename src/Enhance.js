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

const STATUS = {
  PREFETCH: 'PREFETCH',
  INJECT: 'INJECT',
  PENDING: 'PENDING',
  LIVE: 'LIVE',
};

export default (Nexus) => (Component, getNexusBindings = Component.prototype.getNexusBindings) =>
  class extends React.Component {
    static displayName = `Nexus${Component.displayName}`;

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
          return [STATUS.PREFETCH, this.getFlux(flux).prefetch(path)];
        }
        if(this.getFlux(flux).isInjecting) {
          return [STATUS.INJECT, this.getFlux(flux).getInjected(path)];
        }
        return [STATUS.PENDING, defaultValue];
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
        // in all other cases (INJECT, PENDING, LIVE) then the value is unwrapped
        return value;
      });
    }

    waitForPrefetching() {
      return Promise.all(_.map(this.state, ([status, value]) =>
        status === STATUS.PREFETCH ? value.promise : Promise.resolve()
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
          this.getFlux(flux).getStore(path, lifespan)
          .onUpdate(({ head }) => this.setState({ [stateKey]: [STATUS.LIVE, head] }))
          .onDelete(() => this.setState({ [stateKey]: void 0 }));
          this.setState({ [stateKey]: [STATUS.PENDING, defaultValue] });
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
      const nexusContext = { nexus: this.getNexus() };
      const dataMap = this.getDataMap();
      const { props } = this;
      const merges = { nexusContext, props, dataMap };
      const childProps = Object.assign({}, ..._.values(merges));
      if(__DEV__) {
        _.each(merges, (mergeA, indexA) =>
          _.each(merges, (mergeB, indexB) => {
            if(mergeA !== mergeB && _.intersection(_.keys(mergeA), _.keys(mergeB)).length !== 0) {
              console.warn('react-nexus:',
                this.constructor.displayName,
                'has conflicting keys:',
                { [indexA]: mergeA, [indexB]: mergeB }
              );
            }
          })
        );
      }
      // Key conflicts priority: { nexus } > this.props > this.getDataMap()
      return <Component {...childProps} />;
    }
  };
