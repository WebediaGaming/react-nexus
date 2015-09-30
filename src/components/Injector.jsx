import _ from 'lodash';
import deepEqual from 'deep-equal';
import React from 'react';

import Flux from '../fluxes/Flux';
import pureShouldComponentUpdate from '../utils/pureShouldComponentUpdate';
import preparable from '../decorators/preparable';

@preparable(({ flux, params }) => flux.populate(params))
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
      versions: flux.versions(params),
    };
    this.unobserve = null;
  }

  componentDidMount() {
    this.subscribe(this.props);
  }

  refreshState({ flux, params }) {
    this.setState({
      versions: flux.versions(params),
    });
  }

  unsubscribe() {
    if(this.unobserve) {
      this.unobserve();
      this.setState({ versions: void 0 });
    }
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
    const { children, flux, params } = this.props;
    return children(flux.versions(params));
  }
}

export default Injector;
