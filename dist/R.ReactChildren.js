"use strict";

require("6to5/polyfill");var Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var _ = R._;
  var React = R.React;

  var _vanillaReactChildren = React.Children;

  var _patchedReactChildren = _.extend({}, React.Children, {
    getChildrenList: function (component) {
      if (null === component || !component.props || !component.props.children) {
        return [];
      }
      var children = [];
      React.Children.forEach(component.props.children, function (child) {
        return children.push(child);
      });
      return children;
    },

    getDescendantsList: function (component) {
      var children = React.Children.getChildrenList(component);
      var descendants = [];
      children.forEach(function (child) {
        descendants.push(child);
        React.Children.getDescendantsList(child).forEach(function (childDescendant) {
          return descendants.push(childDescendant);
        });
      });
      return descendants;
    },

    mapDescendants: function (component, fn) {
      return React.Children.getDescendantsList(component).map(fn);
    },

    mapTree: function (component, fn) {
      var tree = React.Children.getDescendantsList(component, fn);
      tree.unshift(component);
      return tree.map(fn);
    },

    restoreChildren: function () {
      React.Children = _vanillaReactChildren;
      return _vanillaReactChildren;
    },

    patchChildren: function () {
      React.Children = _patchedReactChildren;
      return _patchedReactChildren;
    },

    transformDescendants: function (component, fn) {
      var children = React.Children.getDescendantsList(component);
      if (children.length === 0) {
        return component;
      }
      if (component.props) {
        (function () {
          var transformChild = function (child) {
            return React.Children.transformTree(child, fn);
          };
          component.props.children = React.Children.mapDescendants(component, transformChild);
        })();
      }
      return component;
    },

    transformTree: function (component, fn) {
      return React.Children.transformDescendants(fn(component), fn);
    } });

  return _patchedReactChildren.patchChildren();
};