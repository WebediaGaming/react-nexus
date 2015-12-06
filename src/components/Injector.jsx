import _ from 'lodash';
import deepEqual from 'deep-equal';
import Promise from 'bluebird';
import React from 'react';

import pureShouldComponentUpdate from '../utils/pureShouldComponentUpdate';
import Flux from '../fluxes/Flux';
import preparable from '../decorators/preparable';

function diff(prev, next) {
  return [
    _.pick(prev, (v, k) => !_.has(next, k) || !deepEqual(next[k], prev[k])),
    _.pick(next, (v, k) => !_.has(prev, k) || !deepEqual(prev[k], next[k])),
  ];
}

function destructureProps(props) {
  const { children, shouldComponentUpdate, ...otherProps } = props;
  return {
    children,
    shouldComponentUpdate,
    bindings: _.pick(otherProps, (val) => val instanceof Flux.Binding),
    other: _.omit(otherProps, (val) => val instanceof Flux.Binding),
  };
}

@preparable((props) => {
  const { bindings } = destructureProps(props);
  return Promise.all(_.map(bindings, (binding) => binding.populate()));
})
class Injector extends React.Component {
  static displayName = 'Nexus.Injector';
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
    this.state = _.mapValues(bindings, (binding) => binding.versions());
    this.unobserve = {};
  }

  componentDidMount() {
    const { bindings } = destructureProps(this.props);
    _.each(bindings, (binding, key) => this.subscribe(binding, key));
  }

  componentWillReceiveProps(nextProps) {
    const { bindings: prevBindings } = destructureProps(this.props);
    const { bindings: nextBindings } = destructureProps(nextProps);
    const [removed, added] = diff(prevBindings, nextBindings);
    _.each(removed, (binding, key) => this.unsubscribe(key));
    _.each(added, (binding, key) => this.subscribe(binding, key));
  }

  shouldComponentUpdate(...args) {
    return this.props.shouldComponentUpdate.apply(this, ...args);
  }

  componentWillUnmount() {
    const { bindings } = destructureProps(this.props);
    _.each(Object.keys(bindings), (key) => this.unsubscribe(key));
  }

  refreshState(binding, key) {
    this.setState({
      [key]: binding.versions(),
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

  subscribe(binding, key) {
    this.unsubscribe(key);
    this.refreshState(binding, key);
    this.unobserve[key] = binding.observe(() => this.refreshState(binding, key));
  }

  render() {
    const { props } = this;
    const { children, bindings, other } = destructureProps(props);
    const childProps = Object.assign({},
      other,
      _.mapValues(bindings, (binding) => binding.versions())
    );
    return children(childProps);
  }
}

export default Injector;
