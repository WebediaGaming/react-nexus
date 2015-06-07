import Flux from 'nexus-flux';
import Immutable from 'immutable';
import React from 'react';
const { Remutable, Lifespan } = Flux;

const Nexus = {};

function isCompositeComponentElement(element) {
  if(!React.isValidElement(element)) {
    return false;
  }
  if(__DEV__) {
    element.should.be.an.Object;
    element.should.have.property('type');
  }
  const { type } = element;
  if(_.isString(type)) { // eg. 'div'
    return false;
  }
  if(__DEV__) {
    type.should.be.a.Function;
    type.should.have.property('prototype');
  }
  const { prototype } = element.type;
  // @see https://github.com/facebook/react/blob/master/src/test/ReactTestUtils.js#L86-L97
  return _.isFunction(prototype.render) && _.isFunction(prototype.setState);
}

function isReactNexusComponentInstance(instance) {
  return _.isObject(instance) && instance.isReactNexusComponentInstance;
}

function isReactNexusRootInstance(instance) {
  return _.isObject(instance) && instance.isReactNexusRootInstance;
}

// flatten the descendants of a given element into an array
// use an accumulator to avoid lengthy lists construction and merging.
function flattenDescendants(element, acc = []) {
  if(__DEV__) {
    acc.should.be.an.Array;
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

function constructReactElementInstance(element) {
  if(__DEV__) {
    React.isValidElement(element).should.be.true;
  }
  // subject to change in upcoming versions of React
  return new element.type(element._store ? element._store.props : element.props);
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
    return instance.waitForNexus();
  })
  .disposer(({ lifespan, instance })=> {
    lifespan.release();
    destroyReactElementInstance(instance);
  });
}

function getDisposableReactComponentInstance(element, nexus) {
  return Promise.try(() => {
    const prevNexus = Nexus.currentNexus;
    Nexus.currentNexus = nexus;
    const instance = constructReactElementInstance(element);
    Nexus.currentNexus = prevNexus;
    if(isReactNexusComponentInstance(instance)) {
      return instance.waitForPrefetching();
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
      _.each(nexus, (flux, k) => flux.startInjecting(data[k]));
      const prevNexus = Nexus.currentNexus;
      Nexus.currentNexus = nexus;
      const html = renderToString(React.cloneElement(element, { nexus, lifespan }));
      Nexus.currentNexus = prevNexus;
      _.each(nexus, (flux) => flux.stopInjecting());
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

  // A global reference to the current nexus context, mapping keys to Flux client objects
  // It is set temporarly in the server during the prefetching/prerendering phase,
  // and set durably in the browser during the mounting phase.
  currentNexus: null,

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
