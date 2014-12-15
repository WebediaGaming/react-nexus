"use strict";

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var _ = R._;
  var React = R.React;

  var $ = (function () {
    var $ = function $(component) {
      this._subject = component;
    };

    $.prototype.get = function () {
      return this._subject;
    };

    $.prototype.type = function (optType) {
      if (optType) {
        this._subject = optType(this._subject.props);
        return this;
      } else {
        return this._subject.type;
      }
    };

    $.prototype.prop = function (key, optVal) {
      if (optVal) {
        this._subject = this._subject.type(this._subject.props);
        this._subject.props[key] = optVal;
        return this;
      } else {
        return this._subject.props[key];
      }
    };

    $.prototype.props = function (arg) {
      var _this = this;
      if (_.isArray(arg)) {
        return _.object(arg.map(function (val, key) {
          return [key, _this._subject.props[key]];
        }));
      } else {
        this._subject = this._subject.type(this._subject.props);
        arg.forEach(function (val, key) {
          return _this._subject.props[key] = val;
        });
        return this;
      }
    };

    $.prototype.classNameList = function (optVal) {
      if (optVal) {
        return this.prop("className", optVal.join(" "));
      } else {
        return (this.prop("className") || "").split(" ");
      }
    };

    $.prototype.addClassName = function (className) {
      var cx = this.classNameList();
      cx.push(className);
      return this.prop("className", _.uniq(cx));
    };

    $.prototype.removeClassName = function (className) {
      var cx = this.classNameList();
      cx = _.without(cx, className);
      return this.prop("className", cx);
    };

    $.prototype.hasClassName = function (className) {
      var cx = this.classNameList();
      return _.contains(cx, className);
    };

    $.prototype.toggleClassName = function (className, optVal) {
      if (!_.isUndefined(optVal)) {
        if (optVal) {
          return this.addClassName(className);
        } else {
          return this.removeClassName(className);
        }
      } else {
        return this.toggleClassName(className, !this.hasClassName(className));
      }
    };

    $.prototype.append = function (component) {
      var children = React.Children.getChildrenList(this._subject);
      children.push(component);
      return this.prop("children", children);
    };

    $.prototype.prepend = function (component) {
      var children = React.Children.getChildrenList(this._subject);
      children.unshift(component);
      return this.prop("children", children);
    };

    $.prototype.transformTree = function (fn) {
      this._subject = React.Children.transformTree(this._subject, fn);
      return this;
    };

    $.prototype.tap = function (fn) {
      fn(this._subject);
      return this;
    };

    $.prototype.walkTree = function (fn) {
      var tree = React.Children.mapTree(this._subject, _.identity);
      tree.forEach(fn);
      return this;
    };

    $.prototype.endend = function () {
      var _subject = this._subject;
      this._subject = null;
      return _subject;
    };

    return $;
  })();

  _.extend($.prototype, /** @lends $.prototype */{
    _subject: null });

  return $;
};