'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _nexusFlux = require('nexus-flux');

var _nexusFlux2 = _interopRequireDefault(_nexusFlux);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
var Remutable = _nexusFlux2['default'].Remutable;
var Lifespan = _nexusFlux2['default'].Lifespan;

var Nexus = {};

function isCompositeComponentElement(element) {
  if (!_react2['default'].isValidElement(element)) {
    return false;
  }
  var prototype = element.type.prototype;

  // @see https://github.com/facebook/react/blob/master/src/test/ReactTestUtils.js#L86-L97
  return _.isFunction(prototype.render) && _.isFunction(prototype.setState);
}

function isReactNexusComponent(instance) {
  return _.isObject(instance) && _.isObject(instance.constructor) && _.isFunction(instance.constructor.isReactNexusComponent);
}

// flatten the descendants of a given element into an array
// use an accumulator to avoid lengthy lists construction and merging.
function flattenDescendants(element) {
  var acc = arguments[1] === undefined ? [] : arguments[1];

  if (__DEV__) {
    acc.should.be.an.Array;
  }
  // only pass through valid elements
  if (!_react2['default'].isValidElement(element)) {
    return acc;
  }
  acc.push(element);
  if (element.props && element.props.children) {
    _react2['default'].Children.forEach(element.props.children, function (child) {
      return flattenDescendants(child, acc);
    });
  }
  return acc;
}

// Temporarly set the global nexus context and run a synchronous function within this context
function withNexus(nexus, fn) {
  var previousNexus = Nexus.currentNexus;
  Nexus.currentNexus = nexus;
  var r = fn();
  Nexus.currentNexus = previousNexus;
  return r;
}

function shouldPrefetch(element) {
  return _react2['default'].isValidElement(element) && _.isFunction(element.type) && isCompositeComponentElement(element);
}

function getPrefetchedReactComponent(element, nexus) {
  var instance = null;
  return withNexus(nexus, function () {
    // subject to change in upcoming versions of React
    instance = new element.type(element._store ? element._store.props : element.props);
    if (!isReactNexusComponent(instance)) {
      return Promise.resolve(instance);
    }
    return instance.waitForPrefetching();
  }).then(function () {
    withNexus(nexus, function () {
      return instance && instance.componentWillMount && instance.componentWillMount();
    });
    return instance;
  }).disposer(function () {
    return withNexus(nexus, function () {
      return instance && instance.componentWillUnmount && instance.componentWillUnmount();
    });
  });
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
  return Promise['try'](function () {
    if (__DEV__) {
      _react2['default'].isValidElement(element).should.be['true'];
      nexus.should.be.an.Object;
      __NODE__.should.be['true'];
    }
    if (shouldPrefetch(element)) {
      return Promise.using(getPrefetchedReactComponent(element, nexus), function (instance) {
        return withNexus(nexus, function () {
          return Promise.all(_.map(flattenDescendants(instance.render ? instance.render() : null), function (descendantElement) {
            return prefetchElement(descendantElement, nexus);
          }));
        });
      });
    }
  });
}

// In the server, prefetch the dependencies and store them in the nexus as a side effect.
// It will recursively prefetch all the nexus dependencies of all the components at the initial state.
function prefetchApp(rootElement, nexus) {
  return Promise['try'](function () {
    if (__DEV__) {
      _react2['default'].isValidElement(rootElement).should.be['true'];
      nexus.should.be.an.Object;
      __NODE__.should.be['true'];
    }
    _.each(nexus, function (flux) {
      return flux.startPrefetching();
    });
    return prefetchElement(rootElement, nexus);
  }).then(function () {
    return _.mapValues(nexus, function (flux) {
      return flux.stopPrefetching();
    });
  });
}

_Object$assign(Nexus, {
  // expose internal libs
  Lifespan: Lifespan,
  React: _react2['default'],
  Remutable: Remutable,

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
  prerenderApp: function prerenderApp(rootElement, nexus) {
    return Promise['try'](function () {
      if (__DEV__) {
        _react2['default'].isValidElement(rootElement).should.be['true'];
        nexus.should.be.an.Object;
        __NODE__.should.be['true'];
        _.each(nexus, function (flux) {
          return flux.should.be.an.instanceOf(_nexusFlux2['default'].Client);
        });
      }
      return prefetchApp(rootElement, nexus).then(function (data) {
        _.each(nexus, function (flux, key) {
          return flux.startInjecting(data[key]);
        });
        var html = withNexus(nexus, function () {
          return _react2['default'].renderToString(rootElement);
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
        _react2['default'].isValidElement(rootElement).should.be['true'];
        nexus.should.be.an.Object;
        __NODE__.should.be['true'];
        _.each(nexus, function (flux) {
          return flux.should.be.an.instanceOf(_nexusFlux2['default'].Client);
        });
      }
      return prefetchApp(rootElement, nexus).then(function (data) {
        _.each(nexus, function (flux, key) {
          return flux.startInjecting(data[key]);
        });
        var html = withNexus(nexus, function () {
          return _react2['default'].renderToStaticMarkup(rootElement);
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
      _react2['default'].isValidElement(rootElement).should.be['true'];
      nexus.should.be.an.Object;
      data.should.be.an.Object;
      domNode.should.be.an.Object;
      __BROWSER__.should.be['true'];
      _.each(nexus, function (flux) {
        return flux.should.be.an.instanceOf(_nexusFlux2['default'].Client);
      });
      (Nexus.currentNexus === null).should.be['true'];
    }
    Nexus.currentNexus = nexus;
    _.each(nexus, function (flux, key) {
      return flux.startInjecting(data[key]);
    });
    var r = _react2['default'].render(rootElement, domNode);
    _.each(nexus, function (flux, key) {
      return flux.stopInjecting(data[key]);
    });
    return r;
  },

  checkBindings: function checkBindings(bindings) {
    if (__DEV__) {
      bindings.should.be.an.Object;
      _.each(bindings, function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var flux = _ref2[0];
        var path = _ref2[1];

        flux.should.be.a.String;
        path.should.be.a.String;
      });
    }
    return bindings;
  },

  PropTypes: _Object$assign({}, _react2['default'].PropTypes, {
    Immutable: {
      Map: function Map(props, propName) {
        return _immutable2['default'].Map.isMap(props[propName]) ? null : new Error('Expecting an Immutable.Map');
      } } }),

  STATUS: {
    PREFETCH: 'PREFETCH',
    INJECT: 'INJECT',
    PENDING: 'PENDING',
    LIVE: 'LIVE' } });

exports['default'] = Nexus;
module.exports = exports['default'];
/* defaultValue */