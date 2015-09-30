import _ from 'lodash';
import deepEqual from 'deep-equal';
import Promise from 'bluebird';
import React from 'react';
import should from 'should/as-function';

const __DEV__ = process.env.NODE_ENV === 'development';

import pureShouldComponentUpdate from '../utils/pureShouldComponentUpdate';
import omitChildren from '../utils/omitChildren';
import Flux from '../fluxes/Flux';
import preparable from '../decorators/preparable';

function diff(prev, next) {
  return [
    _.filter(prev, (v, k) => !_.has(next, k) || !deepEqual(next[k], prev[k])),
    _.filter(next, (v, k) => !_.has(prev, k) || !deepEqual(prev[k], next[k])),
  ];
}

function omitShouldComponentUpdate(props) {
  return _.omit(props, 'shouldComponentUpdate');
}

function destructureProps(props) {
  return {
    children: props.children,
    shouldComponentUpdate: props.shouldComponentUpdate,
    bindings: omitChildren(omitShouldComponentUpdate(props)),
  };
}

@preparable((props) => {
  const { bindings } = destructureProps(props);
  return Promise.all(_.map(bindings, ({ flux, params }) => flux.populate(params)));
})
class MultiInjector extends React.Component {
  static displayName = 'Nexus.MultiInjector';
  static propTypes = {
    children: React.PropTypes.func.isRequired,
    shouldComponentUpdate: React.PropTypes.func,
  };
  static defaultProps = {
    shouldComponentUpdate: pureShouldComponentUpdate,
  };

  constructor(props, context) {
    super(props, context);
    const { bindings } = destructureProps(this.props);
    if(__DEV__) {
      _.each(bindings, ({ flux }) => should(flux).be.an.instanceOf(Flux));
    }
    this.state = _.mapValues(bindings, ({ flux, params }) =>
      flux.versions(params)
    );
    this.unobserve = {};
  }

  componentDidMount() {
    const { bindings } = destructureProps(this.props);
    _.each(bindings, ({ flux, params }, key) =>
      this.subscribe({ flux, params }, key)
    );
  }

  refreshState({ flux, params }, key) {
    this.setState({
      [key]: flux.versions(params),
    });
  }

  unsubscribe(key) {
    if(_.has(this.unobserve, key)) {
      this.unobserve[key]();
      this.setState({
        [key]: void 0,
      });
      delete this.unobserve[key];
    }
  }

  subscribe({ flux, params }, key) {
    this.unsubscribe(key);
    this.refreshState({ flux, params }, key);
    this.unobserve[key] = flux.observe(params).map(() =>
      this.refreshState({ flux, params }, key)
    );
  }

  componentWillReceiveProps(nextProps) {
    const { bindings: prevBindings } = destructureProps(this.props);
    const { bindings: nextBindings } = destructureProps(nextProps);
    if(__DEV__) {
      _.each(nextBindings, ({ flux }) => should(flux).be.an.instanceOf(Flux));
    }
    const [removed, added] = diff(prevBindings, nextBindings);
    _.each(removed, ({ flux, params }, key) => this.unsubscribe(key));
    _.each(added, ({ flux, params }, key) => this.subscribe({ flux, params }, key));
  }

  componentWillUnmount() {
    const { bindings } = destructureProps(this.props);
    _.each(Object.keys(bindings), (key) => this.unsubscribe(key));
  }

  shouldComponentUpdate(...args) {
    return this.props.shouldComponentUpdate.apply(this, ...args);
  }

  render() {
    const { children, bindings } = destructureProps(this.props);
    return children(_.mapValues(bindings, ({ flux, params }) => flux.versions(params)));
  }
}

export default MultiInjector;
