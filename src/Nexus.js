import React from 'react';
import instanciateReactComponent from 'react/lib/instanciateReactComponent';
import Mixin from './Mixin';

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

const Nexus = {
  React, // reference to the React object

  Mixin, // reference to the Nexus React mixin

  // A global reference to the current nexus context, mapping keys to Flux client objects
  // It is set temporarly in the server during the prefetching/prerendering phase,
  // and set durably in the browser during the mounting phase.
  currentNexus: null,

  // Temporarly set the global nexus context and run a synchronous function within this context
  withNexus(nexus, fn) {
    const previousNexus = Nexus.currentNexus;
    Nexus.currentNexus = nexus;
    const r = fn();
    Nexus.currentNexus = previousNexus;
    return r;
  },

  // In the server, prefetch the dependencies and store them in the fluxes as a side effect.
  // It will recursively prefetch all the nexus dependencies of all the components at the initial state.
  prefetchApp(rootElement, fluxes) {
    if(__DEV__) {
      React.isValidElement(rootElement).should.be.true;
      fluxes.should.be.an.Object;
      __NODE__.should.be.true;
    }
    _.each(fluxes, (flux) => flux.startPrefetching());
    return Nexus._prefetchElement(rootElement, fluxes)
    .then(() => _.mapValues(fluxes, (flux) => flux.stopPrefetching());
  },

  // In the server, prefetch, then renderToString, then inject all this in the given pageTemplate,
  // passing the pageTemplate function two parameters: html (the prendered html string), and prefetched
  // (a plain JS object representing the prefetched data, to be used by mountApp afterwards).
  prerenderApp(rootElement, fluxes, pageTemplate) {
    if(__DEV__) {
      React.isValidElement(rootElement).should.be.true;
      fluxes.should.be.an.Object;
      pageTemplate.should.be.a.Function;
      __NODE__.should.be.true;
    }
    return Nexus.prefetchApp(rootElement, fluxes)
    .then((prefetched) => {
      _.each(fluxes, (flux, key) => flux.startInjecting(prefetched[key]));
      const html = Nexus.withNexus(fluxes, () => React.renderToString(rootElement));
      _.each(fluxes, (flux, key) => flux.stopInjecting());
      return pageTemplate({ html, prefetched });
    });
  }

  // In the client, mount the rootElement using the given fluxes and the given prefetched data into
  // the given domNode. Also globally and durably set the global nexus context.
  mountApp(rootElement, fluxes, prefetched, domNode) {
    if(__DEV__) {
      React.isValidElement(rootElement).should.be.true;
      fluxes.should.be.an.Object;
      prefetched.should.be.an.Object;
      domNode.should.be.an.Object;
      __BROWSER__.should.be.true;
      (Nexus.currentNexus === null).should.be.true;
    }
    Nexus.currentNexus = fluxes;
    _.each(fluxes, (flux, key) => flux.startInjecting(prefetched[key]));
    const r = React.render(rootElement, domNode);
    _.each(fluxes, (flux, key) => flux.stopInjecting(prefetched[key]));
    return r;
  }

  // Within a prefetchApp async stack, prefetch the dependencies of the given element and its descendants
  // it will:
  // - instanciate the component
  // - call componentWillMount
  // - yield to prefetch nexus bindings (if applicable)
  // - call render
  // - call componentWillUnmount
  // - yield to recursively prefetch descendant elements
  _prefetchElement(element, fluxes) {
    if(__DEV__) {
      React.isValidElement(element).should.be.true;
      fluxes.should.be.an.Object;
      __NODE__.should.be.true;
    }
    return Promise.try(() => Nexus.withNexus(fluxes, () => {
      const instance = instanciateReactComponent(element);
      return instance.prefetchNexusBindings ? instance.prefetchNexusBindings() : instance;
    }))
    .then((instance) => {
      instance.componentWillMount();
      const childElement = instance.render();
      instance.componentWillUnmount();
      return Promise.all(_.map(flattenDescendants(childElement), (descendantElement) =>
        prefetchElement(descendantElement, fluxes)
      ));
    });
  },
};

export default Nexus;
