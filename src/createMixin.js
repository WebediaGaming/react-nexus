import { Lifespan } from 'nexus-flux';

function checkBindings(bindings) {
  if(__DEV__) {
    bindings.should.be.an.Object;
    _.each(bindings, ([flux, path, /* defaultValue */]) => {
      flux.should.be.a.String;
      path.should.be.a.String;
    });
  }
}

const STATUS = {
  PREFETCH: 'PREFETCH',
  INJECT: 'INJECT',
  PENDING: 'PENDING',
  LIVE: 'LIVE',
};

export default (React, Nexus) => {
  const prototype = {
    _nexusBindings: null,

    _nexusBindingsLifespans: null,

    getNexus() {
      if(__DEV__) {
        (Nexus.currentNexus !== null).should.be.ok;
      }
      return Nexus.currentNexus;
    },

    getNexusFlux(flux) {
      if(__DEV__) {
        this.getNexus().should.have.property(flux);
      }
      return this.getNexus()[flux];
    },

    getNexusCurrentValue(key) {
      if(__DEV__) {
        key.should.be.a.String;
        this.state.should.have.property(key);
      }
    },

    getNexusState() {
      return _.pick(this.state, _.values(this.getNexusBindings(this.props)));
    },

    getNexusDataMap() {
      return _.mapValues(this.getNexusState(), ([status, value]) => {
        // in this case only, the value is wrapped
        if(status === STATUS.PREFETCH) {
          return value.value();
        }
        // in all other cases (INJECT, PENDING, LIVE) then the value is unwrapped
        return value;
      });
    },

    waitForNexusPrefetching() {
      return Promise.all(_.map(this.getNexusState(), ([status, value]) =>
        status === STATUS.PREFETCH ? value.promise : Promise.resolve()
      ));
    },

    applyNexusBindings(props) {
      const prevBindings = this._nexusBindings || {};
      const prevLifespans = this._nexusBindingsLifespans || {};
      const nextLifespans = {};
      const nextBindings = this.getNexusBindings(props);

      _.each(_.union(_.keys(prevBindings), _.keys(nextBindings)), (stateKey) => {
        const prev = prevBindings[stateKey];
        const next = nextBindings[stateKey];
        const addNextBinding = () => {
          const [flux, path, defaultValue] = next;
          const lifespan = nextLifespans[stateKey] = new Lifespan();
          this.getNexusFlux(flux).getStore(path, lifespan)
          .onUpdate(({ head }) => this.setState({ [stateKey]: [STATUS.LIVE, head] }))
          .onDelete(() => this.setState({ [stateKey]: void 0 }));
          this.setState({ [stateKey]: [STATUS.PENDING, defaultValue] });
        };
        const removePrevBinding = () => {
          this.setState({ [stateKey]: void 0 });
          prevLifespans[stateKey].release();
        };
        // binding is added
        if(prev === void 0) {
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
    },

    releaseNexusBindings() {
      _.each(this._nexusBindingsLifespans || [], (lifespan) => lifespan.release());
    },
  };

  function mixin(Component, getNexusBindings = Component.prototype.getNexusBindings) {
    if(__DEV__) {
      Component.should.be.a.Function;
      getNexusBindings.should.be.a.Function;
      // check that there are no key conflicts
      Object.keys(prototype).forEach((propertyName) => Component.should.not.have.property(propertyName));
    }

    class ReactNexusComponent extends Component {
      constructor(props) {
        if(__DEV__) {
          getNexusBindings.should.be.a.Function;
        }
        super(props);
        this._nexusBindings = {};
        this._nexusBindingsLifespans = {};
        const bindings = getNexusBindings(props);
        checkBindings(bindings);
        this.state = this.state || {};
        Object.assign(this.state, _.mapValues(bindings, ([flux, path, defaultValue]) => {
          if(this.getNexusFlux(flux).isPrefetching) {
            return [STATUS.PREFETCH, this.getNexusFlux(flux).prefetch(path).promise];
          }
          if(this.getNexusFlux(flux).isInjecting) {
            return [STATUS.INJECT, this.getNexusFlux(flux).getInjected(path)];
          }
          return [STATUS.PENDING, defaultValue];
        }));
      }

      componentDidMount() {
        if(super.componentDidMount) {
          super.componentDidMount();
        }
        this.applyNexusBindings(this.props);
      }

      componentWillUnmount() {
        if(super.componentWillUnmount) {
          super.componentWillUnmount();
        }
        this.releaseNexusBindings();
      }

      componentWillReceiveProps(props) {
        if(super.componentWillReceiveProps) {
          super.componentWillReceiveProps(props);
        }
      }

      shouldComponentUpdate(nextProps, nextState) {
        return (super.shouldComponentUpdate ? super.shouldComponentUpdate() : false) ||
          !_.isEqual(this.state, nextState) ||
          !_.isEqual(this.props, nextProps);
      }
    }

    Object.assign(ReactNexusComponent.prototype, prototype, { getNexusBindings });
    return ReactNexusComponent;
  }

  Object.assign(mixin, { React });

  return mixin;
};
