import Flux from 'nexus-flux';
import Immutable from 'immutable';
import React from 'react';
const { Remutable, Lifespan } = Flux;

const Nexus = {};

function isCompositeComponentElement(element) {
  if(!React.isValidElement(element)) {
    return false;
  }
  const { prototype } = element.type;
  // @see https://github.com/facebook/react/blob/master/src/test/ReactTestUtils.js#L86-L97
  return _.isFunction(prototype.render) && _.isFunction(prototype.setState);
}

function isReactNexusComponentInstance(instance) {
  return _.isObject(instance) && instance.isReactNexusComponentInstance;
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

// Temporarly set the global nexus context and run a synchronous function within this context
function withNexus(nexus, fn) {
  const previousNexus = Nexus.currentNexus;
  Nexus.currentNexus = nexus;
  const r = fn();
  Nexus.currentNexus = previousNexus;
  return r;
}

function shouldPrefetch(element) {
  return (
    React.isValidElement(element) &&
    _.isFunction(element.type) &&
    isCompositeComponentElement(element)
  );
}

function getPrefetchedReactComponent(element, nexus) {
  let instance = null;
  return withNexus(nexus, () => {
    // subject to change in upcoming versions of React
    instance = new element.type(element._store ? element._store.props : element.props);
    if(!isReactNexusComponentInstance(instance)) {
      return Promise.resolve(instance);
    }
    return instance.waitForPrefetching();
  })
  .then(() => {
    withNexus(nexus, () =>
      instance && instance.componentWillMount && instance.componentWillMount()
    );
    return instance;
  })
  .disposer(() => withNexus(nexus, () => instance && instance.componentWillUnmount && instance.componentWillUnmount()));
}

// Within a prefetchApp async stack, prefetch the dependencies of the given element and its descendants
// it will:
// - instanciate the component
// - call componentWillMount
// - yield to prefetch nexus bindings (if applicable)
// - call render
// - call componentWillUnmount
// - yield to recursively prefetch descendant elements
function prefetchElement(element, nexus) {
  return Promise.try(() => {
    if(__DEV__) {
      React.isValidElement(element).should.be.true;
      nexus.should.be.an.Object;
      __NODE__.should.be.true;
    }
    if(shouldPrefetch(element)) {
      return Promise.using(getPrefetchedReactComponent(element, nexus), (instance) =>
        withNexus(nexus, () =>
          Promise.all(
            _.map(flattenDescendants(instance.render ? instance.render() : null), (descendantElement) =>
              prefetchElement(descendantElement, nexus)
            )
          )
        )
      );
    }
  });
}

// In the server, prefetch the dependencies and store them in the nexus as a side effect.
// It will recursively prefetch all the nexus dependencies of all the components at the initial state.
function prefetchApp(rootElement, nexus) {
  return Promise.try(() => {
    if(__DEV__) {
      React.isValidElement(rootElement).should.be.true;
      nexus.should.be.an.Object;
      __NODE__.should.be.true;
    }
    _.each(nexus, (flux) => flux.startPrefetching());
    return prefetchElement(rootElement, nexus);
  })
  .then(() => _.mapValues(nexus, (flux) => flux.stopPrefetching()));
}

Object.assign(Nexus, {
  // expose internal libs
  Lifespan,
  React,
  Remutable,

  // Enhance a component (placeholder slot)
  // @see bind.js
  bind: null,
  // Generic Injector component (placeholder slot)
  // @see Injector.js
  Injector: null,

  // A global reference to the current nexus context, mapping keys to Flux client objects
  // It is set temporarly in the server during the prefetching/prerendering phase,
  // and set durably in the browser during the mounting phase.
  currentNexus: null,

  // In the server, prefetch, then renderToString, then return the generated HTML string and the raw prefetched data,
  // which can then be injected into the server response (eg. using a global variable).
  // It will be used by the browser to call mountApp.
  prerenderApp(rootElement, nexus) {
    return Promise.try(() => {
      if(__DEV__) {
        React.isValidElement(rootElement).should.be.true;
        nexus.should.be.an.Object;
        __NODE__.should.be.true;
        _.each(nexus, (flux) => flux.should.be.an.instanceOf(Flux.Client));
      }
      return prefetchApp(rootElement, nexus)
      .then((data) => {
        _.each(nexus, (flux, key) => flux.startInjecting(data[key]));
        const html = withNexus(nexus, () => React.renderToString(rootElement));
        _.each(nexus, (flux) => flux.stopInjecting());
        return [html, data];
      });
    });
  },

  prerenderAppToStaticMarkup(rootElement, nexus) {
    return Promise.try(() => {
      if(__DEV__) {
        React.isValidElement(rootElement).should.be.true;
        nexus.should.be.an.Object;
        __NODE__.should.be.true;
        _.each(nexus, (flux) => flux.should.be.an.instanceOf(Flux.Client));
      }
      return prefetchApp(rootElement, nexus)
      .then((data) => {
        _.each(nexus, (flux, key) => flux.startInjecting(data[key]));
        const html = withNexus(nexus, () => React.renderToStaticMarkup(rootElement));
        _.each(nexus, (flux) => flux.stopInjecting());
        return [html, data];
      });
    });
  },

  // In the client, mount the rootElement using the given nexus and the given prefetched data into
  // the given domNode. Also globally and durably set the global nexus context.
  mountApp(rootElement, nexus, data, domNode) {
    if(__DEV__) {
      React.isValidElement(rootElement).should.be.true;
      nexus.should.be.an.Object;
      data.should.be.an.Object;
      domNode.should.be.an.Object;
      __BROWSER__.should.be.true;
      _.each(nexus, (flux) => flux.should.be.an.instanceOf(Flux.Client));
      (Nexus.currentNexus === null).should.be.true;
    }
    Nexus.currentNexus = nexus;
    _.each(nexus, (flux, key) => flux.startInjecting(data[key]));
    const r = React.render(rootElement, domNode);
    _.each(nexus, (flux, key) => flux.stopInjecting(data[key]));
    return r;
  },

  checkBindings(bindings) {
    if(__DEV__) {
      bindings.should.be.an.Object;
      _.each(bindings, ([flux, path, /* defaultValue */]) => {
        flux.should.be.a.String;
        path.should.be.a.String;
      });
    }
    return bindings;
  },

  PropTypes: Object.assign({}, React.PropTypes, {
    Immutable: {
      Map: (props, propName) => Immutable.Map.isMap(props[propName]) ? null : new Error(`Expecting an Immutable.Map`),
    },
  }),

  STATUS: {
    PREFETCH: 'PREFETCH',
    INJECT: 'INJECT',
    PENDING: 'PENDING',
    LIVE: 'LIVE',
  },
});

export default Nexus;
