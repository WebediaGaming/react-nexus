import Lifespan from 'lifespan';

export default (Nexus) => ({

  mixins: [Lifespan.Mixin],

  _nexusBindingsLifespan: null,

  getNexus() {
    if(__DEV__) {
      (Nexus.currentNexus !== null).should.be.true;
    }
    return Nexus.currentNexus;
  },

  getInitialState() {
    if(__DEV__) {
      if(!_.isFunction(this.getNexusBindings)) {
        throw new TypeError(`You MUST define getNexusBindings on React class ${this.displayName}.`);
      }
    }
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
  },

  prefetchNexusBindings() {
    const bindings = this.getNexusBindings(this.props);
    return Promise.all(_.map(bindings, ([flux, path]) => flux.isPrefetching ? flux.prefetch(path) : Promise.resolve()))
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
    }));
    if(previousBindingsLifespan) {
      previousBindingsLifespan.release();
    }
  },

  componentWillMount() {
    this.getLifespan().onRelease(() => {
      if(this._nexusBindingsLifespan) {
        this._nexusBindingsLifespan.release();
      }
    });
  },

  componentDidMount() {
    this.applyNexusBindings(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.applyNexusBindings(nextProps);
  },

});
