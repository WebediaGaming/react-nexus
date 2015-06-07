'use strict';

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
  if (__DEV__) {
    element.should.be.an.Object;
    element.should.have.property('type');
  }
  var type = element.type;

  if (_.isString(type)) {
    // eg. 'div'
    return false;
  }
  if (__DEV__) {
    type.should.be.a.Function;
    type.should.have.property('prototype');
  }
  var prototype = element.type.prototype;

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

function constructReactElementInstance(element) {
  if (__DEV__) {
    _react2['default'].isValidElement(element).should.be['true'];
  }
  // subject to change in upcoming versions of React
  return new element.type(element._store ? element._store.props : element.props);
}

function renderReactComponentInstanceCompositeDescendants(instance) {
  var children = instance.render ? instance.render() : null;
  var descendants = flattenDescendants(children);
  return _.filter(descendants, isCompositeComponentElement);
}

function initializeReactElementInstance(instance) {
  if (instance && instance.componentWillMount) {
    instance.componentWillMount();
  }
  return instance;
}

function destroyReactElementInstance(instance) {
  if (instance && instance.componentWillUnmount) {
    instance.componentWillUnmount();
  }
  return instance;
}

function getDisposableReactRootInstance(element) {
  return Promise['try'](function () {
    var instance = constructReactElementInstance(element);
    if (!isReactNexusRootInstance(instance)) {
      throw new Error('' + element + ': expecting a React Nexus Root.');
    }
    return instance.waitForNexus();
  }).disposer(function (_ref) {
    var lifespan = _ref.lifespan;
    var instance = _ref.instance;

    lifespan.release();
    destroyReactElementInstance(instance);
  });
}

function getDisposableReactComponentInstance(element, nexus) {
  return Promise['try'](function () {
    var prevNexus = Nexus.currentNexus;
    Nexus.currentNexus = nexus;
    var instance = constructReactElementInstance(element);
    Nexus.currentNexus = prevNexus;
    if (isReactNexusComponentInstance(instance)) {
      return instance.waitForPrefetching();
    }
    return Promise.resolve({ instance: instance });
  }).disposer(function (_ref2) {
    var instance = _ref2.instance;
    return destroyReactElementInstance(instance);
  });
}

function prefetchElement(element, nexus) {
  return Promise.using(getDisposableReactComponentInstance(element, nexus), function (_ref3) {
    var instance = _ref3.instance;

    initializeReactElementInstance(instance);
    return Promise.all(_.map(renderReactComponentInstanceCompositeDescendants(instance), function (childElement) {
      return prefetchElement(childElement, nexus);
    }));
  });
}

function renderTo(element) {
  var renderToString = arguments[1] === undefined ? _react2['default'].renderToString : arguments[1];

  return Promise.using(getDisposableReactRootInstance(element), function (_ref4) {
    var nexus = _ref4.nexus;
    var lifespan = _ref4.lifespan;
    var instance = _ref4.instance;

    _.each(nexus, function (flux) {
      return flux.startPrefetching();
    });
    initializeReactElementInstance(instance);
    return Promise.map(renderReactComponentInstanceCompositeDescendants(instance), function (childElement) {
      return prefetchElement(childElement, nexus);
    }).then(function () {
      return _.mapValues(nexus, function (flux) {
        return flux.stopPrefetching();
      });
    }).then(function (data) {
      _.each(nexus, function (flux, k) {
        return flux.startInjecting(data[k]);
      });
      var prevNexus = Nexus.currentNexus;
      Nexus.currentNexus = nexus;
      var html = renderToString(_react2['default'].cloneElement(element, { nexus: nexus, lifespan: lifespan }));
      Nexus.currentNexus = prevNexus;
      _.each(nexus, function (flux) {
        return flux.stopInjecting();
      });
      return { html: html, data: data };
    });
  });
}

_Object$assign(Nexus, {
  // expose internal libs
  Lifespan: Lifespan,
  React: _react2['default'],
  Remutable: Remutable,

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

  renderToString: function renderToString(rootElement) {
    return renderTo(rootElement, _react2['default'].renderToString);
  },

  renderToStaticMarkup: function renderToStaticMarkup(rootElement) {
    return renderTo(rootElement, _react2['default'].renderToStaticMarkup);
  },

  PropTypes: _Object$assign({}, _react2['default'].PropTypes, {
    Immutable: {
      Map: function Map(props, propName) {
        return _immutable2['default'].Map.isMap(props[propName]) ? null : new Error('Expecting an Immutable.Map');
      } } }) });

exports['default'] = Nexus;
module.exports = exports['default'];