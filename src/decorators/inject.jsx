import _ from 'lodash';
import React from 'react';
import should from 'should/as-function';

const __DEV__ = process.env.NODE_ENV;

import Injector from '../components/Injector';
import Flux from '../Flux';
import pureShouldComponentUpdate from '../utils/pureShouldComponentUpdate';

export default function inject(key, getBinding, customShouldComponentUpdate = pureShouldComponentUpdate) {
  if(__DEV__) {
    should(typeof key).be.oneOf('string', 'symbol');
    should(getBinding).be.a.Function();
  }
  return (Component) => class extends React.Component {
    static displayName = `@inject`;

    shouldComponentUpdate(...args) {
      return customShouldComponentUpdate.apply(this, args);
    }

    render() {
      const { flux, params } = getBinding(this.props, this.context);
      if(__DEV__) {
        should(flux).be.an.instanceOf(Flux);
      }
      return <Injector flux={flux} params={params}>{(values) =>
        <Component {...Object.assign({}, this.props, { [key]: _.last(values) })} />
      }</Injector>;
    }
  };
}
