import _ from 'lodash';
import React from 'react';
import should from 'should/as-function';
const __DEV__ = process.env.NODE_ENV === 'development';

import $nexus from '../$nexus';
import Flux from '../fluxes/Flux';
import MultiInjector from '../components/MultiInjector';
import pureShouldComponentUpdate from '../utils/pureShouldComponentUpdate';
import validateNexus from '../utils/validateNexus';

export default function multiInject(getBindings, customShouldComponentUpdate = pureShouldComponentUpdate) {
  if(__DEV__) {
    should(getBindings).be.a.Function();
  }
  return function $multiInject(Component) {
    return class extends React.Component {
      static displayName = `@multiInject(${Component.displayName})`;
      static contextTypes = {
        [$nexus]: validateNexus,
      };

      shouldComponentUpdate(...args) {
        return customShouldComponentUpdate.apply(this, args);
      }

      render() {
        const { props, context } = this;
        const nexus = context[$nexus];
        const bindings = getBindings(props, nexus);
        if(__DEV__) {
          _.each(bindings, ({ flux }) => should(flux).be.an.instanceOf(Flux));
        }
        return <MultiInjector {...bindings}>{(multiValues) => {
          const childProps = Object.assign({},
            props,
            _.mapValues(multiValues, (values) => values),
            { [$nexus]: nexus }
          );
          return <Component {...childProps} />;
        }}</MultiInjector>;
      }
    };
  };
}
