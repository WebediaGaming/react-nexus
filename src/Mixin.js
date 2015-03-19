import { Lifespan } from 'nexus-flux';

export default (Nexus) => ({

  _nexusBindings: null,
  _nexusBindingsLifespans: null,

  getNexus() {
    if(__DEV__) {
      (Nexus.currentNexus !== null).should.be.true;
    }
    return Nexus.currentNexus;
  },

  _getNexusBindings(props) {
    return this.getNexusBindings ? this.getNexusBindings(props) || {} : {};
  },

  getInitialState() {
    const bindings = this._getNexusBindings(this.props);
    const state = {};
    _.each(bindings, ([flux, path], stateKey) => {
      if(flux.isPrefetching) {
        state[stateKey] = flux.getPrefetched(path); // will return the immutable head
      }
      else if(flux.isInjecting) {
        state[stateKey] = flux.getInjected(path); // will return the immutable head
      }
      else {
        state[stateKey] = null;
      }
    });
    return state;
  },

  prefetchNexusBindings() {
    const bindings = this._getNexusBindings(this.props) || {};
    return Promise.all(_.map(bindings, ([flux, path]) => flux.isPrefetching ? flux.prefetch(path) : Promise.resolve()))
    .then(() => this); // return this to be chainable
  },

  applyNexusBindings(props) {
    const prevBindings = this._nexusBindings || {};
    const prevLifespans = this._nexusBindingsLifespans || {};
    const nextBindings = this._getNexusBindings(props) || {};
    const nextLifespans = {};

    _.each(_.union(_.keys(prevBindings), _.keys(nextBindings)), (stateKey) => {
      const prev = prevBindings[stateKey];
      const next = nextBindings[stateKey];
      const addNextBinding = () => {
        const [flux, path] = next;
        const lifespan = nextLifespans[stateKey] = new Lifespan();
        this.setState({
          [stateKey]: flux.getStore(path, lifespan)
            .onUpdate(({ head }) => this.setState({ [stateKey]: head }))
            .onDelete(() => this.setState({ [stateKey]: void 0 }))
          .value
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
  },

  componentDidMount() {
    this.applyNexusBindings(this.props);
  },

  componentWillUnmount() {
    _.each(this._nexusBindingsLifespans || [], (lifespan) => lifespan.release());
  },

  componentWillReceiveProps(nextProps) {
    this.applyNexusBindings(nextProps);
  },

});
