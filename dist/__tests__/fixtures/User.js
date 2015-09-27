'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _typecheckDecorator = require('typecheck-decorator');

var _typecheckDecorator2 = _interopRequireDefault(_typecheckDecorator);

var _2 = require('../../');

function propType(schema) {
  return _typecheckDecorator2['default'].toPropType(_typecheckDecorator2['default'].shape([_typecheckDecorator2['default'].bool(), // pending
  _typecheckDecorator2['default'].option(_typecheckDecorator2['default'].oneOf(_typecheckDecorator2['default'].exactly(null), _typecheckDecorator2['default'].Error())), // err
  _typecheckDecorator2['default'].option(schema)]));
}

// res
var userSchema = _typecheckDecorator2['default'].shape({
  userId: _typecheckDecorator2['default'].String(),
  userName: _typecheckDecorator2['default'].String(),
  profilePicture: _typecheckDecorator2['default'].String()
});

var _default = (function (_React$Component) {
  _inherits(_default, _React$Component);

  _createClass(_default, null, [{
    key: 'displayName',
    value: 'User',
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      me: propType(userSchema),
      user: propType(userSchema),
      userId: _react2['default'].PropTypes.number.isRequired,
      users: propType(_typecheckDecorator2['default'].Array(userSchema))
    },
    enumerable: true
  }]);

  function _default(props, context) {
    _classCallCheck(this, _default2);

    _get(Object.getPrototypeOf(_default2.prototype), 'constructor', this).call(this, props, context);
    this.state = {};
  }

  _createClass(_default, [{
    key: 'followUser',
    value: function followUser() {
      var userId = this.props.userId;
      var _context = this.context;
      var http = _context.http;
      var local = _context.local;

      this.setState({
        following: http.dispatch('followUser', {
          userId: userId,
          authToken: _lodash2['default'].last(local.values('/authToken'))
        })
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      return _react2['default'].createElement(
        'div',
        null,
        (function (pending, err, users) {
          if (pending) {
            return _react2['default'].createElement(
              'p',
              null,
              'Loading users...'
            );
          }
          if (err) {
            return _react2['default'].createElement(
              'p',
              null,
              err.toString()
            );
          }
          return _react2['default'].createElement(
            'p',
            null,
            'Total users: ',
            users.length
          );
        }).apply(undefined, _toConsumableArray(this.props.users)),
        (function (pending, err, user) {
          if (pending) {
            return _react2['default'].createElement(
              'p',
              null,
              'Loading user...'
            );
          }
          if (err) {
            return _react2['default'].createElement(
              'p',
              null,
              err.toString()
            );
          }
          var userName = user.userName;
          var profilePicture = user.profilePicture;

          return _react2['default'].createElement(
            'p',
            null,
            'Username ',
            userName,
            ' ',
            _react2['default'].createElement('img', { src: profilePicture }),
            (function (_ref) {
              var following = _ref.following;

              if (!following || following.isPending()) {
                return _react2['default'].createElement(
                  'button',
                  { onClick: function () {
                      return _this.followUser();
                    }, disabled: following.isPending() },
                  'Follow user'
                );
              }
              if (following.isRejected()) {
                return _react2['default'].createElement(
                  'p',
                  null,
                  following.reason().toString()
                );
              }
              return _react2['default'].createElement(
                'p',
                null,
                following.value().toString()
              );
            })(_this.state)
          );
        }).apply(undefined, _toConsumableArray(this.props.user))
      );
    }
  }]);

  var _default2 = _default;
  _default = (0, _2.pure)(_default) || _default;
  _default = (0, _2.multiInject)(function (_ref2, _ref3) {
    var userId = _ref2.userId;
    var http = _ref3.http;
    var local = _ref3.local;
    return {
      me: http.get('/me', {
        authToken: _lodash2['default'].last(local.values('/authToken'))
      }),
      user: http.get('/users/' + userId, { refreshEvery: 5000 }),
      users: http.get('/users', { refreshEvery: 600000 })
    };
  })(_default) || _default;
  return _default;
})(_react2['default'].Component);

exports['default'] = _default;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fdGVzdHNfXy9maXh0dXJlcy9Vc2VyLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQWMsUUFBUTs7OztxQkFDSixPQUFPOzs7O2tDQUNYLHFCQUFxQjs7OztpQkFFRCxRQUFROztBQUUxQyxTQUFTLFFBQVEsQ0FBQyxNQUFNLEVBQUU7QUFDeEIsU0FBTyxnQ0FBRSxVQUFVLENBQUMsZ0NBQUUsS0FBSyxDQUFDLENBQzFCLGdDQUFFLElBQUksRUFBRTtBQUNSLGtDQUFFLE1BQU0sQ0FBQyxnQ0FBRSxLQUFLLENBQUMsZ0NBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLGdDQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDN0Msa0NBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUNqQixDQUFDLENBQUMsQ0FBQztDQUNMOzs7QUFFRCxJQUFNLFVBQVUsR0FBRyxnQ0FBRSxLQUFLLENBQUM7QUFDekIsUUFBTSxFQUFFLGdDQUFFLE1BQU0sRUFBRTtBQUNsQixVQUFRLEVBQUUsZ0NBQUUsTUFBTSxFQUFFO0FBQ3BCLGdCQUFjLEVBQUUsZ0NBQUUsTUFBTSxFQUFFO0NBQzNCLENBQUMsQ0FBQzs7Ozs7OztXQVdvQixNQUFNOzs7O1dBQ1I7QUFDakIsUUFBRSxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUM7QUFDeEIsVUFBSSxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUM7QUFDMUIsWUFBTSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVTtBQUN6QyxXQUFLLEVBQUUsUUFBUSxDQUFDLGdDQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUNyQzs7OztBQUVVLG9CQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7OztBQUMxQixxRkFBTSxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQ3RCLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0dBQ2pCOzs7O1dBRVMsc0JBQUc7VUFDSCxNQUFNLEdBQUssSUFB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OiJfX3Rlc3RzX18vZml4dHVyZXMvVXNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBUIGZyb20gJ3R5cGVjaGVjay1kZWNvcmF0b3InO1xyXG5cclxuaW1wb3J0IHsgbXVsdGlJbmplY3QsIHB1cmUgfSBmcm9tICcuLi8uLi8nO1xyXG5cclxuZnVuY3Rpb24gcHJvcFR5cGUoc2NoZW1hKSB7XHJcbiAgcmV0dXJuIFQudG9Qcm9wVHlwZShULnNoYXBlKFtcclxuICAgIFQuYm9vbCgpLCAvLyBwZW5kaW5nXHJcbiAgICBULm9wdGlvbihULm9uZU9mKFQuZXhhY3RseShudWxsKSwgVC5FcnJvcigpKSksIC8vIGVyclxyXG4gICAgVC5vcHRpb24oc2NoZW1hKSwgLy8gcmVzXHJcbiAgXSkpO1xyXG59XHJcblxyXG5jb25zdCB1c2VyU2NoZW1hID0gVC5zaGFwZSh7XHJcbiAgdXNlcklkOiBULlN0cmluZygpLFxyXG4gIHVzZXJOYW1lOiBULlN0cmluZygpLFxyXG4gIHByb2ZpbGVQaWN0dXJlOiBULlN0cmluZygpLFxyXG59KTtcclxuXHJcbkBtdWx0aUluamVjdCgoeyB1c2VySWQgfSwgeyBodHRwLCBsb2NhbCB9KSA9PiAoe1xyXG4gIG1lOiBodHRwLmdldChgL21lYCwge1xyXG4gICAgYXV0aFRva2VuOiBfLmxhc3QobG9jYWwudmFsdWVzKCcvYXV0aFRva2VuJykpLFxyXG4gIH0pLFxyXG4gIHVzZXI6IGh0dHAuZ2V0KGAvdXNlcnMvJHt1c2VySWR9YCwgeyByZWZyZXNoRXZlcnk6IDUwMDAgfSksXHJcbiAgdXNlcnM6IGh0dHAuZ2V0KGAvdXNlcnNgLCB7IHJlZnJlc2hFdmVyeTogNjAwMDAwIH0pLFxyXG59KSlcclxuQHB1cmVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdVc2VyJztcclxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgbWU6IHByb3BUeXBlKHVzZXJTY2hlbWEpLFxyXG4gICAgdXNlcjogcHJvcFR5cGUodXNlclNjaGVtYSksXHJcbiAgICB1c2VySWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIHVzZXJzOiBwcm9wVHlwZShULkFycmF5KHVzZXJTY2hlbWEpKSxcclxuICB9O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xyXG4gIH1cclxuXHJcbiAgZm9sbG93VXNlcigpIHtcclxuICAgIGNvbnN0IHsgdXNlcklkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgY29uc3QgeyBodHRwLCBsb2NhbCB9ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGZvbGxvd2luZzogaHR0cC5kaXNwYXRjaCgnZm9sbG93VXNlcicsIHtcclxuICAgICAgICB1c2VySWQsXHJcbiAgICAgICAgYXV0aFRva2VuOiBfLmxhc3QobG9jYWwudmFsdWVzKCcvYXV0aFRva2VuJykpLFxyXG4gICAgICB9KSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgcmV0dXJuIDxkaXY+XHJcbiAgICAgIHsocGVuZGluZywgZXJyLCB1c2VycykgPT4ge1xyXG4gICAgICAgIGlmKHBlbmRpbmcpIHtcclxuICAgICAgICAgIHJldHVybiA8cD5Mb2FkaW5nIHVzZXJzLi4uPC9wPjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICByZXR1cm4gPHA+e2Vyci50b1N0cmluZygpfTwvcD47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiA8cD5Ub3RhbCB1c2Vyczoge3VzZXJzLmxlbmd0aH08L3A+O1xyXG4gICAgICB9KC4uLnRoaXMucHJvcHMudXNlcnMpfVxyXG4gICAgICB7KHBlbmRpbmcsIGVyciwgdXNlcikgPT4ge1xyXG4gICAgICAgIGlmKHBlbmRpbmcpIHtcclxuICAgICAgICAgIHJldHVybiA8cD5Mb2FkaW5nIHVzZXIuLi48L3A+O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihlcnIpIHtcclxuICAgICAgICAgIHJldHVybiA8cD57ZXJyLnRvU3RyaW5nKCl9PC9wPjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgeyB1c2VyTmFtZSwgcHJvZmlsZVBpY3R1cmUgfSA9IHVzZXI7XHJcbiAgICAgICAgcmV0dXJuIDxwPlxyXG4gICAgICAgICAgVXNlcm5hbWUge3VzZXJOYW1lfSA8aW1nIHNyYz17cHJvZmlsZVBpY3R1cmV9IC8+XHJcbiAgICAgICAgICB7KHsgZm9sbG93aW5nIH0pID0+IHtcclxuICAgICAgICAgICAgaWYoIWZvbGxvd2luZyB8fCBmb2xsb3dpbmcuaXNQZW5kaW5nKCkpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB0aGlzLmZvbGxvd1VzZXIoKX0gZGlzYWJsZWQ9e2ZvbGxvd2luZy5pc1BlbmRpbmcoKX0+Rm9sbG93IHVzZXI8L2J1dHRvbj47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoZm9sbG93aW5nLmlzUmVqZWN0ZWQoKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiA8cD57Zm9sbG93aW5nLnJlYXNvbigpLnRvU3RyaW5nKCl9PC9wPjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gPHA+e2ZvbGxvd2luZy52YWx1ZSgpLnRvU3RyaW5nKCl9PC9wPjtcclxuICAgICAgICAgIH0odGhpcy5zdGF0ZSl9XHJcbiAgICAgICAgPC9wPjtcclxuICAgICAgfSguLi50aGlzLnByb3BzLnVzZXIpfVxyXG4gICAgPC9kaXY+O1xyXG4gIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=