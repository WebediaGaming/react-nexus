import Flux from 'nexus-flux';
import Immutable from 'immutable';
import React from 'react';
import _ from 'lodash';
import Promise from 'bluebird';
import should from 'should';

const { Remutable, Lifespan } = Flux;
const __DEV__ = process.env.NODE_ENV === 'development';

import { $isComponentInstance, $isRootInstance, $waitForPrefetching } from './symbols';

const Nexus = {};

function isCompositeComponentElement(element) {
  if(!React.isValidElement(element)) {
    return false;
  }
  if(__DEV__) {
    should(element).be.an.Object;
    should(element).have.property('type');
  }
  const { type } = element;
  if(_.isString(type)) { // eg. 'div'
    return false;
  }
  if(__DEV__) {
    should(type).be.a.Function;
    should(type).have.property('prototype');
  }
  const { prototype } = element.type;
  // @see https://github.com/facebook/react/blob/master/src/test/ReactTestUtils.js#L86-L97
  return _.isFunction(prototype.render) && _.isFunction(prototype.setState);
}

function isReactNexusComponentInstance(instance) {
  return _.isObject(instance) && instance[$isComponentInstance];
}

function isReactNexusRootInstance(instance) {
  return _.isObject(instance) && instance[$isRootInstance];
}

// flatten the descendants of a given element into an array
// use an accumulator to avoid lengthy lists construction and merging.
function flattenDescendants(element, acc = []) {
  if(__DEV__) {
    should(acc).be.an.Array;
  }
  // only pass through valid elements
  if(!React.isValidElement(element)) {
    return acc;
  }
  acc.push(element);
  if(element.props && element.props.children) {
    React.Children.forEach(element.props.children, (child) => flattenDescendants(child, acc));
  }
  return acc;
}

function constructReactElementInstance(element, context = {}) {
  if(__DEV__) {
    should(React.isValidElement(element)).be.true;
  }
  // subject to change in upcoming versions of React
  return new element.type(element._store ? element._store.props : element.props, context);
}

function renderReactComponentInstanceCompositeDescendants(instance) {
  const children = instance.render ? instance.render() : null;
  const descendants = flattenDescendants(children);
  return _.filter(descendants, isCompositeComponentElement);
}

function initializeReactElementInstance(instance) {
  if(instance && instance.componentWillMount) {
    instance.componentWillMount();
  }
  return instance;
}

function destroyReactElementInstance(instance) {
  if(instance && instance.componentWillUnmount) {
    instance.componentWillUnmount();
  }
  return instance;
}

function getDisposableReactRootInstance(element) {
  return Promise.try(() => {
    const instance = constructReactElementInstance(element);
    if(!isReactNexusRootInstance(instance)) {
      throw new Error(`${element}: expecting a React Nexus Root.`);
    }
    return instance.getNexus();
  })
  .disposer(({ lifespan, instance })=> {
    lifespan.release();
    destroyReactElementInstance(instance);
  });
}

function getDisposableReactComponentInstance(element, nexus) {
  return Promise.try(() => {
    const instance = constructReactElementInstance(element, { nexus });
    if(isReactNexusComponentInstance(instance)) {
      return instance[$waitForPrefetching]();
    }
    return Promise.resolve({ instance });
  })
  .disposer(({ instance }) => destroyReactElementInstance(instance));
}

function prefetchElement(element, nexus) {
  return Promise.using(getDisposableReactComponentInstance(element, nexus), ({ instance }) => {
    initializeReactElementInstance(instance);
    return Promise.all(_.map(renderReactComponentInstanceCompositeDescendants(instance),
      (childElement) => prefetchElement(childElement, nexus)
    ));
  });
}

function renderTo(element, renderToString = React.renderToString) {
  return Promise.using(getDisposableReactRootInstance(element), ({ nexus, lifespan, instance }) => {
    _.each(nexus, (flux) => flux.startPrefetching());
    initializeReactElementInstance(instance);
    return Promise.map(renderReactComponentInstanceCompositeDescendants(instance),
      (childElement) => prefetchElement(childElement, nexus)
    )
    .then(() => _.mapValues(nexus, (flux) => flux.stopPrefetching()))
    .then((data) => {
      const html = renderToString(React.cloneElement(element, { nexus, lifespan, data }));
      _.each(nexus, (flux) => {
        if(flux.isInjecting) {
          flux.stopInjecting();
        }
      });
      return { html, data };
    });
  });
}

Object.assign(Nexus, {
  // expose internal libs
  Lifespan,
  React,
  Remutable,

  // Root decorator (placeholder slot)
  // @see root.js
  root: null,

  // Component decorator (placeholder slot)
  // @see component.js
  component: null,

  renderToString(rootElement) {
    return renderTo(rootElement, React.renderToString);
  },

  renderToStaticMarkup(rootElement) {
    return renderTo(rootElement, React.renderToStaticMarkup);
  },

  PropTypes: Object.assign({}, React.PropTypes, {
    Immutable: {
      Map(props, propName) {
        if(!Immutable.Map.isMap(props[propName])) {
          return new Error(`Expecting an Immutable.Map for ${propName}.`);
        }
        return null;
      },
    },
  }),
});

export default Nexus;
