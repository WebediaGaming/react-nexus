'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Object$create = require('babel-runtime/core-js/object/create')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Nexus = require('./Nexus');

var _Nexus2 = _interopRequireDefault(_Nexus);

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

function bindRoot(Component) {
  var createNexus = arguments[1] === undefined ? Component.prototype.createNexus : arguments[1];
  var defaultRender = arguments[2] === undefined ? Component.prototype.defaultRender || function () {
    return null;
  } : arguments[2];
  var displayName = arguments[3] === undefined ? 'NexusRoot' + Component.displayName : arguments[3];
  return (function () {

    if (__DEV__) {
      createNexus.should.be.a.Function;
      displayName.should.be.a.String;
    }

    return (function (_React$Component) {
      var _class = function (_ref) {
        var _ref$nexus = _ref.nexus;
        var nexus = _ref$nexus === undefined ? null : _ref$nexus;
        var _ref$lifespan = _ref.lifespan;
        var lifespan = _ref$lifespan === undefined ? null : _ref$lifespan;
        var _ref$data = _ref.data;
        var data = _ref$data === undefined ? null : _ref$data;

        var otherProps = _objectWithoutProperties(_ref, ['nexus', 'lifespan', 'data']);

        _classCallCheck(this, _class);

        // eslint-disable-line
        _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, otherProps);
        this.isReactNexusRootInstance = true;
        this.state = { mounted: false, nexus: nexus };
        // nexus and lifespan should either be both null or none is null
        if (nexus !== null) {
          if (__DEV__) {
            (lifespan !== null).should.be['true'];
          }
          this.state.promiseForNexus = Promise.resolve({ nexus: nexus, lifespan: lifespan, instance: this });
        } else {
          if (__DEV__) {
            (lifespan === null).should.be['true'];
          }
          this.state.promiseForNexus = this.createAndRegisterNexus(_extends({ data: data }, otherProps)); // eslint-disable-line
        }
      };

      _inherits(_class, _React$Component);

      _createClass(_class, [{
        key: 'getOtherProps',
        value: function getOtherProps() {
          return _.omit(this.props, ['nexus', 'data']);
        }
      }, {
        key: 'createAndRegisterNexus',
        value: function createAndRegisterNexus(_ref2) {
          var _this = this;

          var data = _ref2.data;

          var otherProps = _objectWithoutProperties(_ref2, ['data']);

          // eslint-disable-line object-shorthand
          var promise = createNexus.call(this, _extends({ data: data }, otherProps)) // eslint-disable-line object-shorthand
          .then(function (_ref3) {
            var nexus = _ref3.nexus;
            var lifespan = _ref3.lifespan;

            return { nexus: nexus, lifespan: lifespan, instance: _this };
          });
          promise.then(function (_ref4) {
            var nexus = _ref4.nexus;
            return _this.setNexus(nexus);
          });
          return promise;
        }
      }, {
        key: 'setNexus',
        value: function setNexus(nexus) {
          var _this2 = this;

          _Nexus2['default'].currentNexus = nexus;
          var mounted = this.state.mounted;

          if (!mounted) {
            _Object$assign(this.state, { nexus: nexus });
          } else {
            _.each(nexus, function (flux, k) {
              return flux.startInjecting(_this2.props.data[k]);
            });
            this.setState({ nexus: nexus }, function () {
              return _.each(nexus, function (flux) {
                return flux.stopInjecting();
              });
            });
          }
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.setState({ mounted: true });
        }
      }, {
        key: 'waitForNexus',
        value: function waitForNexus() {
          var _this3 = this;

          return this.state.promiseForNexus.then(function (_ref5) {
            var nexus = _ref5.nexus;
            var lifespan = _ref5.lifespan;
            return { nexus: nexus, lifespan: lifespan, instance: _this3 };
          });
        }
      }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
          // prevent re-rendering on the client while nexus is null
          if (__BROWSER__ && nextState.nexus === null) {
            return false;
          }
          return _react2['default'].PureRenderMixin.shouldComponentUpdate.call(this, nextProps, nextState);
        }
      }, {
        key: 'render',
        value: function render() {
          var nexus = this.state.nexus;

          var otherProps = this.getOtherProps();
          if (nexus === null) {
            // apply defaultRender to a fake, non-constructed instance of Component with the same props
            return defaultRender.call(_Object$create(Component.prototype, { props: otherProps }));
          }
          return _react2['default'].createElement(Component, otherProps);
        }
      }], [{
        key: 'displayName',
        value: displayName,
        enumerable: true
      }, {
        key: 'propTypes',
        value: {
          data: _react2['default'].PropTypes.object,
          lifespan: _react2['default'].PropTypes.object,
          nexus: _react2['default'].PropTypes.object },
        enumerable: true
      }]);

      return _class;
    })(_react2['default'].Component);
  })();
}

exports['default'] = bindRoot;
module.exports = exports['default'];