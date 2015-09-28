import _ from 'lodash';
import React from 'react';
import should from 'should/as-function';
const __DEV__ = process.env.NODE_ENV === 'development';

import Flux from '../Flux';
import MultiInjector from '../components/MultiInjector';
import pureShouldComponentUpdate from '../utils/pureShouldComponentUpdate';

export default function multiInject(getBindings, customShouldComponentUpdate = pureShouldComponentUpdate) {
  if(__DEV__) {
    should(getBindings).be.a.Function();
  }
  return (Component) => class DecoratedMultiInjector extends React.Component {
    static displayName = `@multiInject`;

    shouldComponentUpdate(...args) {
      return customShouldComponentUpdate.apply(this, args);
    }

    render() {
      const bindings = getBindings(this.props, this.context);
      if(__DEV__) {
        _.each(bindings, ({ flux }) => flux.should.be.an.instanceOf(Flux));
      }
      return <MultiInjector {...bindings}>{(multiValues) =>
        <Component {...Object.assign({}, this.props, _.mapValues(multiValues, (value) => _.last(value)))} />
      }</MultiInjector>;
    }
  };
}
