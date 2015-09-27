import _ from 'lodash';
import deepEqual from 'deep-equal';
import React from 'react';

import Flux from './Flux';
import pureShouldComponentUpdate from './pureShouldComponentUpdate';

class Injector extends React.Component {
  static displayName = 'Nexus.Injector';
  static propTypes = {
    children: React.PropTypes.func.isRequired,
    flux: React.PropTypes.instanceOf(Flux).isRequired,
    params: React.PropTypes.any,
    shouldComponentUpdate: React.PropTypes.func,
  };
  static defaultProps = {
    shouldComponentUpdate: pureShouldComponentUpdate,
  };

  constructor(props, context) {
    super(props, context);
    const { flux, params } = this.props;
    this.state = {
      values: flux.values(params),
    };
    this.unobserve = _.noop;
  }

  componentDidMount() {
    this.subscribe(this.props);
  }

  refreshState({ flux, params }) {
    this.setState({
      values: flux.values(params),
    });
  }

  unsubscribe() {
    this.unobserve();
    this.setState({ values: void 0 });
  }

  subscribe({ flux, params }) {
    this.unsubscribe();
    this.refreshState({ flux, params });
    this.unobserve = flux.observe(params, () =>
      this.refreshState({ flux, params })
    );
  }

  componentWillReceiveProps(nextProps) {
    if(_.any([
      !deepEqual(this.props.flux, nextProps.flux),
      !deepEqual(this.props.params, nextProps.params),
    ])) {
      this.subscribe(nextProps);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  shouldComponentUpdate(...args) {
    return this.props.shouldComponentUpdate.apply(this, args);
  }

  render() {
    const { values } = this.state;
    return this.children(values);
  }
}

export default Injector;
