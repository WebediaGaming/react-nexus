import React from 'react';
import Immutable from 'immutable';
import pure from 'pure-render-decorator';

import Nexus from './Nexus';
const { Lifespan } = Nexus;

const STATUS = {
  PREFETCH: Symbol('PREFETCH'),
  INJECT: Symbol('INJECT'),
  PENDING: Symbol('PENDING'),
  SYNCING: Symbol('SYNCING'),
  LIVE: Symbol('LIVE'),
};

function getDefaultBindings() {
  return {};
}

function bindComponent(
  Component,
  getBindings = Component.prototype.getNexusBindings,
  displayName = `NexusComponent${Component.displayName}`
  ) {
  const _getBindings = getBindings || getDefaultBindings;

  if(__DEV__) {
    Component.should.be.a.Function;
    _getBindings.should.be.a.Function;
    displayName.should.be.a.String;
  }

  return @pure class extends React.Component {
    static displayName = displayName;

    isReactNexusComponentInstance = true;

    state = null;
    bindings = null;
    lifespans = null;

    getBindings(props) {
      const nexus = Nexus.currentNexus;
      return _.mapValues(_getBindings(props), ([binding, defaultValue]) => {
        const [key, path] = _.isString(binding) ? binding.split(':/') : binding;
        const flux = nexus[key];
        return [flux, path, Immutable.Map(defaultValue)];
      });
    }

    getOtherProps(props) {
      return props;
    }

    getStoreProps() {
      return _.mapValues(this.state, ([status, value, defaultValue]) => {
        if(status === STATUS.PREFETCH) {
          return value.head === null ? defaultValue : value.head;
        }
        return value;
      });
    }

    getChildrenProps() {
      return Object.assign({ nexus: Nexus.currentNexus }, this.getOtherProps(this.props), this.getStoreProps());
    }

    updateBindings(nextBindings = {}) {
      const prevBindings = this.bindings;
      const lifespans = this.lifespans;
      _(prevBindings)
        .pairs()
        // bindings to be replaced or removed altogether
        // shallow comparison of binding value ([flux, path, defaultValue])
        .filter(([k, v]) => !_.isEqual(nextBindings[k], v))
        .each(([k]) => {
          lifespans[k].release();
          delete lifespans[k];
          this.setState({ [k]: void 0 });
        })
      .commit();

      _(nextBindings)
        .pairs()
        // bindings replaced or inserted altogether
        // shallow comparison of binding value ([flux, path, defaultValue])
        .filter(([k, v]) => !_.isEqual(prevBindings[k], v))
        .each(([k, v]) => {
          const [flux, path, defaultValue] = v;
          const store = flux.getStore(path, lifespans[k] = new Lifespan())
            .onUpdate((head) => this.setState({ [k]: [STATUS.LIVE, head, defaultValue] }))
            .onDelete(() => this.setState({ [k]: [STATUS.LIVE, defaultValue, defaultValue] }));
          this.setState({ [k]: [STATUS.SYNCING, store.value || defaultValue, defaultValue]});
        })
      .commit();

      this.bindings = nextBindings;
    }

    componentWillReceiveProps(nextProps) {
      this.updateBindings(this.getBindings(this.getOtherProps(nextProps)));
    }

    componentDidMount() {
      this.updateBindings(this.getBindings(this.getOtherProps(this.props)));
    }

    componentWillUnmount() {
      this.updateBindings({});
    }

    waitForPrefetching() {
      return Promise.all(_.map(this.state,
        ([status, value]) => status === STATUS.PREFETCH ? value.promise : Promise.resolve()
      ))
      .then(() => ({ instance: this }));
    }

    constructor(props) { // eslint-disable-line object-shorthand
      super(props);
      this.bindings = {};
      this.lifespans = {};
      this.state = _.mapValues(this.getBindings(props), ([flux, path, defaultValue]) => {
        if(flux.isPrefetching) {
          return [STATUS.PREFETCH, flux.prefetch(path), defaultValue];
        }
        if(flux.isInjecting) {
          return [STATUS.INJECT, flux.getInjected(path), defaultValue];
        }
        return [STATUS.PENDING, defaultValue, defaultValue];
      });
    }

    render() {
      return <Component {...this.getChildrenProps()} />;
    }
  };
}

export default bindComponent;
