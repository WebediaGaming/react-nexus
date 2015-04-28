'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createEnhance = require('./Enhance');

var _createEnhance2 = _interopRequireDefault(_createEnhance);

var _Flux = require('nexus-flux');

var _Flux2 = _interopRequireDefault(_Flux);

require('babel/polyfill');
var _ = require('lodash');
var should = require('should');
var Promise = (global || window).Promise = require('bluebird');
var __DEV__ = process.env.NODE_ENV !== 'production';
var __PROD__ = !__DEV__;
var __BROWSER__ = typeof window === 'object';
var __NODE__ = !__BROWSER__;
if (__DEV__) {
  Promise.longStackTraces();
  Error.stackTraceLimit = Infinity;
}
var Remutable = _Flux2['default'].Remutable;
var Lifespan = _Flux2['default'].Lifespan;

exports['default'] = function (React) {
  function isCompositeComponentElement(element) {
    if (!React.isValidElement(element)) {
      return false;
    }
    var prototype = element.type.prototype;

    // @see https://github.com/facebook/react/blob/master/src/test/ReactTestUtils.js#L86-L97
    return _.isFunction(prototype.render) && _.isFunction(prototype.setState);
  }

  function isReactNexusComponent(instance) {
    return _.isObject(instance) && _.isObject(instance.prototype) && _.isFunction(instance.prototype.waitForPrefetching);
  }

  // flatten the descendants of a given element into an array
  // use an accumulator to avoid lengthy lists construction and merging.
  function flattenDescendants(element) {
    var acc = arguments[1] === undefined ? [] : arguments[1];

    if (__DEV__) {
      acc.should.be.an.Array;
    }
    if (!React.isValidElement(element)) {
      // only pass through valid elements
      return acc;
    }
    acc.push(element);
    if (element.props && element.props.children) {
      React.Children.forEach(element.props.children, function (child) {
        return flattenDescendants(child, acc);
      });
    }
    return acc;
  }

  // A nexus object is just a collection of Flux.Client objects.

  var Nexus = {
    // expose internal libs
    Lifespan: Lifespan,
    React: React,
    Remutable: Remutable,

    Enhance: null, // reference to the Nexus React mixin

    // A global reference to the current nexus context, mapping keys to Flux client objects
    // It is set temporarly in the server during the prefetching/prerendering phase,
    // and set durably in the browser during the mounting phase.
    currentNexus: null,

    shouldPrefetch: function shouldPrefetch(element) {
      return React.isValidElement(element) && _.isFunction(element.type) && isCompositeComponentElement(element);
    },

    // In the server, prefetch, then renderToString, then return the generated HTML string and the raw prefetched data,
    // which can then be injected into the server response (eg. using a global variable).
    // It will be used by the browser to call mountApp.
    prerenderApp: function prerenderApp(rootElement, nexus) {
      return Promise['try'](function () {
        if (__DEV__) {
          React.isValidElement(rootElement).should.be['true'];
          nexus.should.be.an.Object;
          __NODE__.should.be['true'];
          _.each(nexus, function (flux) {
            return flux.should.be.an.instanceOf(_Flux2['default'].Client);
          });
        }
        return Nexus._prefetchApp(rootElement, nexus).then(function (data) {
          _.each(nexus, function (flux, key) {
            return flux.startInjecting(data[key]);
          });
          var html = Nexus._withNexus(nexus, function () {
            return React.renderToString(rootElement);
          });
          _.each(nexus, function (flux) {
            return flux.stopInjecting();
          });
          return [html, data];
        });
      });
    },

    prerenderAppToStaticMarkup: function prerenderAppToStaticMarkup(rootElement, nexus) {
      return Promise['try'](function () {
        if (__DEV__) {
          React.isValidElement(rootElement).should.be['true'];
          nexus.should.be.an.Object;
          __NODE__.should.be['true'];
          _.each(nexus, function (flux) {
            return flux.should.be.an.instanceOf(_Flux2['default'].Client);
          });
        }
        return Nexus._prefetchApp(rootElement, nexus).then(function (data) {
          _.each(nexus, function (flux, key) {
            return flux.startInjecting(data[key]);
          });
          var html = Nexus._withNexus(nexus, function () {
            return React.renderToStaticMarkup(rootElement);
          });
          _.each(nexus, function (flux) {
            return flux.stopInjecting();
          });
          return [html, data];
        });
      });
    },

    // In the client, mount the rootElement using the given nexus and the given prefetched data into
    // the given domNode. Also globally and durably set the global nexus context.
    mountApp: function mountApp(rootElement, nexus, data, domNode) {
      if (__DEV__) {
        React.isValidElement(rootElement).should.be['true'];
        nexus.should.be.an.Object;
        data.should.be.an.Object;
        domNode.should.be.an.Object;
        __BROWSER__.should.be['true'];
        _.each(nexus, function (flux) {
          return flux.should.be.an.instanceOf(_Flux2['default'].Client);
        });
        (Nexus.currentNexus === null).should.be['true'];
      }
      Nexus.currentNexus = nexus;
      _.each(nexus, function (flux, key) {
        return flux.startInjecting(data[key]);
      });
      var r = React.render(rootElement, domNode);
      _.each(nexus, function (flux, key) {
        return flux.stopInjecting(data[key]);
      });
      return r;
    },

    // Temporarly set the global nexus context and run a synchronous function within this context
    _withNexus: function _withNexus(nexus, fn) {
      var previousNexus = Nexus.currentNexus;
      Nexus.currentNexus = nexus;
      var r = fn();
      Nexus.currentNexus = previousNexus;
      return r;
    },

    // In the server, prefetch the dependencies and store them in the nexus as a side effect.
    // It will recursively prefetch all the nexus dependencies of all the components at the initial state.
    _prefetchApp: function _prefetchApp(rootElement, nexus) {
      return Promise['try'](function () {
        if (__DEV__) {
          React.isValidElement(rootElement).should.be['true'];
          nexus.should.be.an.Object;
          __NODE__.should.be['true'];
        }
        _.each(nexus, function (flux) {
          return flux.startPrefetching();
        });
        return Nexus._prefetchElement(rootElement, nexus);
      }).then(function () {
        return _.mapValues(nexus, function (flux) {
          return flux.stopPrefetching();
        });
      });
    },

    _getPrefetchedReactComponent: function _getPrefetchedReactComponent(element, nexus) {
      var instance = null;
      return Nexus._withNexus(nexus, function () {
        instance = new element.type(element._store.props);
        if (!isReactNexusComponent(instance)) {
          return Promise.resolve(instance);
        }
        return instance.waitForPrefetching();
      }).then(function () {
        Nexus._withNexus(nexus, function () {
          return instance && instance.componentWillMount && instance.componentWillMount();
        });
        return instance;
      }).disposer(function () {
        return Nexus._withNexus(nexus, function () {
          return instance && instance.componentWillUnmount && instance.componentWillUnmount();
        });
      });
    },

    // Within a prefetchApp async stack, prefetch the dependencies of the given element and its descendants
    // it will:
    // - instanciate the component
    // - call componentWillMount
    // - yield to prefetch nexus bindings (if applicable)
    // - call render
    // - call componentWillUnmount
    // - yield to recursively prefetch descendant elements
    _prefetchElement: function _prefetchElement(element, nexus) {
      return Promise['try'](function () {
        if (__DEV__) {
          React.isValidElement(element).should.be['true'];
          nexus.should.be.an.Object;
          __NODE__.should.be['true'];
        }
        if (Nexus.shouldPrefetch(element)) {
          return Promise.using(Nexus._getPrefetchedReactComponent(element, nexus), function (instance) {
            return Nexus._withNexus(nexus, function () {
              return Promise.all(_.map(flattenDescendants(instance.render ? instance.render() : null), function (descendantElement) {
                return Nexus._prefetchElement(descendantElement, nexus);
              }));
            });
          });
        }
      });
    } };

  Nexus.Enhance = _createEnhance2['default'](React, Nexus);

  return Nexus;
};

module.exports = exports['default'];