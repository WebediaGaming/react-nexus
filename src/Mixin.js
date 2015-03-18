import { Lifespan } from 'nexus-flux';

export default (Nexus) => ({

  _nexusBindingsLifespan: null,

  getNexus() {
    if(__DEV__) {
      (Nexus.currentNexus !== null).should.be.true;
    }
    return Nexus.currentNexus;
  },

  getNexusBindingsLifespan() {
    return this._nexusBindingsLifespan;
  },

  __getNexusBindings(props) {
    return this.getNexusBindings ? this.getNexusBindings(props) || {} : {};
  },

  getInitialState() {
    const bindings = this.__getNexusBindings(this.props);
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
    const bindings = this.__getNexusBindings(this.props) || {};
    return Promise.all(_.map(bindings, ([flux, path]) => flux.isPrefetching ? flux.prefetch(path) : Promise.resolve()))
    .then(() => this); // return this to be chainable
  },

  applyNexusBindings(props) {
    const previousBindingsLifespan = this.getNexusBindingsLifespan();
    this._nexusBindingsLifespan = [];
    const bindings = this.__getNexusBindings(props) || {};
    _.each(bindings, ([flux, path], stateKey) => {
      const lifespan = new Lifespan();
      this._nexusBindingsLifespan.push({lifespan, path});
      this.setState({
        [stateKey]: flux.getStore(path, lifespan)
        .onUpdate(({ head }) => this.setState({ [stateKey]: head }))
        .onDelete(() => this.setState({ [stateKey]: void 0 }))
          .value, // will also return the immutable head
        });
    });

    if(previousBindingsLifespan) {
      previousBindingsLifespan.map(({lifespan, path}) => {
        if(_.find(this._nexusBindingsLifespan, {path}) === void 0){
          lifespan.release();
        }
      });
    }
  },

  componentDidMount() {
    this.applyNexusBindings(this.props);
  },

  componentWillUnmount() {
    if(this._nexusBindingsLifespan) {
       this._nexusBindingsLifespan.map(({lifespan}) => {
          lifespan.release();
      });
    }
  },

  componentWillReceiveProps(nextProps) {
    this.applyNexusBindings(nextProps);
  },

});
