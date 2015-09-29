import React from 'react';
import should from 'should/as-function';

const __DEV__ = process.env.NODE_ENV;

import $nexus from '../$nexus';
import Flux from '../fluxes/Flux';
import Injector from '../components/Injector';
import pureShouldComponentUpdate from '../utils/pureShouldComponentUpdate';
import validateNexus from '../utils/validateNexus';

export default function inject(key, getBinding, customShouldComponentUpdate = pureShouldComponentUpdate) {
  if(__DEV__) {
    should(typeof key).be.oneOf('string', 'symbol');
    should(getBinding).be.a.Function();
  }
  return function $inject(Component) {
    return class extends React.Component {
      static displayName = `@inject(${Component.displayName})`;
      static contextTypes = {
        [$nexus]: validateNexus,
      };

      shouldComponentUpdate(...args) {
        return customShouldComponentUpdate.apply(this, args);
      }

      render() {
        const { props, context } = this;
        const nexus = context[$nexus];
        const { flux, params } = getBinding(props, nexus);
        if(__DEV__) {
          should(flux).be.an.instanceOf(Flux);
        }
        return <Injector flux={flux} params={params}>{(values) => {
          const childProps = Object.assign({},
            props,
            { [key]: values },
            { [$nexus]: nexus }
          );
          return <Component {...childProps} />;
        }}</Injector>;
      }
    };
  };
}
