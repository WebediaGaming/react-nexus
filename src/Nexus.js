import React from 'react';
import instanciateReactComponent from 'react/lib/instantiateReactComponent';
import Mixin from './Mixin';
import Flux from 'nexus-flux';

// flatten the descendants of a given element into an array
// use an accumulator to avoid lengthy lists construction and merging.
function flattenDescendants(element, acc = []) {
  if(element === null || _.isString(element)) {
    return acc;
  }
  acc.push(element);
  if(element.props && element.props.children) {
    React.Children.forEach((child) => flattenDescendants(child, acc));
  }
  return acc;
}

// A nexus object is just a collection of Flux.Client objects.

const Nexus = {
  React, // reference to the React object

  Mixin: null, // reference to the Nexus React mixin

  // A global reference to the current nexus context, mapping keys to Flux client objects
  // It is set temporarly in the server during the prefetching/prerendering phase,
  // and set durably in the browser during the mounting phase.
  currentNexus: null,

  // In the server, prefetch, then renderToString, then return the generated HTML string and the raw prefetched data,
  // which can then be injected into the server response (eg. using a global variable).
  // It will be used by the browser to call mountApp.
  prerenderApp(rootElement, nexus) {
    if(__DEV__) {
      React.isValidElement(rootElement).should.be.true;
      nexus.should.be.an.Object;
      __NODE__.should.be.true;
      _.each(nexus, (flux) => flux.should.be.an.instanceOf(Flux.Client));
    }
    return Nexus._prefetchApp(rootElement, nexus)
    .then((data) => {
      _.each(nexus, (flux, key) => flux.startInjecting(data[key]));
      const html = Nexus._withNexus(nexus, () => React.renderToString(rootElement));
      _.each(nexus, (flux) => flux.stopInjecting());
      return [html, data];
    });
  },

  prerenderAppToStaticMarkup(rootElement, nexus) {
    if(__DEV__) {
      React.isValidElement(rootElement).should.be.true;
      nexus.should.be.an.Object;
      __NODE__.should.be.true;
      _.each(nexus, (flux) => flux.should.be.an.instanceOf(Flux.Client));
    }
    return Nexus._prefetchApp(rootElement, nexus)
    .then((data) => {
      _.each(nexus, (flux, key) => flux.startInjecting(data[key]));
      const html = Nexus._withNexus(nexus, () => React.renderToStaticMarkup(rootElement));
      _.each(nexus, (flux) => flux.stopInjecting());
      return [html, data];
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

  // Temporarly set the global nexus context and run a synchronous function within this context
  _withNexus(nexus, fn) {
    const previousNexus = Nexus.currentNexus;
    Nexus.currentNexus = nexus;
    const r = fn();
    Nexus.currentNexus = previousNexus;
    return r;
  },

  // In the server, prefetch the dependencies and store them in the nexus as a side effect.
  // It will recursively prefetch all the nexus dependencies of all the components at the initial state.
  _prefetchApp(rootElement, nexus) {
    if(__DEV__) {
      React.isValidElement(rootElement).should.be.true;
      nexus.should.be.an.Object;
      __NODE__.should.be.true;
    }
    return Promise.try(() => {
      _.each(nexus, (flux) => flux.startPrefetching());
      return Nexus._prefetchElement(rootElement, nexus);
    })
    .then(() => _.mapValues(nexus, (flux) => flux.stopPrefetching()));
  },

  // Within a prefetchApp async stack, prefetch the dependencies of the given element and its descendants
  // it will:
  // - instanciate the component
  // - call componentWillMount
  // - yield to prefetch nexus bindings (if applicable)
  // - call render
  // - call componentWillUnmount
  // - yield to recursively prefetch descendant elements
  _prefetchElement(element, nexus) {
    if(__DEV__) {
      React.isValidElement(element).should.be.true;
      nexus.should.be.an.Object;
      __NODE__.should.be.true;
    }
    return Promise.try(() => Nexus._withNexus(nexus, () => {
      const instance = instanciateReactComponent(element);
      return instance.prefetchNexusBindings ? instance.prefetchNexusBindings() : instance;
    }))
    .then((instance) => Nexus._withNexus(nexus, () => {
      if(instance.componentWillMount) {
        instance.componentWillMount();
      }
      const childElement = instance.render ? instance.render() : null;
      if(instance.componentWillUnmount) {
        instance.componentWillUnmount();
      }
      return Promise.all(_.map(flattenDescendants(childElement), (descendantElement) =>
        Nexus._prefetchElement(descendantElement, nexus)
      ));
    }));
  },
};

Nexus.Mixin = Mixin(Nexus);

export default Nexus;
