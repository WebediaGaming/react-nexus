'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _typecheckDecorator = require('typecheck-decorator');

var _typecheckDecorator2 = _interopRequireDefault(_typecheckDecorator);

var _2 = require('../../');

function propType(schema) {
  return _typecheckDecorator2['default'].toPropType(_typecheckDecorator2['default'].shape([_typecheckDecorator2['default'].option(_typecheckDecorator2['default'].oneOf(_typecheckDecorator2['default'].exactly(null), _typecheckDecorator2['default'].Error())), // err
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

    _React$Component.call(this, props, context);
    this.state = {};
  }

  _default.prototype.followUser = function followUser() {
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
  };

  _default.prototype.render = function render() {
    var _this = this;

    return _react2['default'].createElement(
      'div',
      null,
      (function (err, users) {
        if (!err && !users) {
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
      (function (err, user) {
        if (!err && !user) {
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
  };

  var _default2 = _default;
  _default = _2.pure(_default) || _default;
  _default = _2.multiInject(function (_ref2, _ref3) {
    var userId = _ref2.userId;
    var http = _ref3.http;
    var local = _ref3.local;
    return {
      me: http.get('/me', {
        query: { authToken: _lodash2['default'].last(local.values('/authToken')) }
      }),
      user: http.get('/users/' + userId),
      users: http.get('/users', { refreshEvery: 600000 })
    };
  })(_default) || _default;
  return _default;
})(_react2['default'].Component);

exports['default'] = _default;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fdGVzdHNfXy9maXh0dXJlcy9Vc2VyLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFBYyxRQUFROzs7O3FCQUNKLE9BQU87Ozs7a0NBQ1gscUJBQXFCOzs7O2lCQUVELFFBQVE7O0FBRTFDLFNBQVMsUUFBUSxDQUFDLE1BQU0sRUFBRTtBQUN4QixTQUFPLGdDQUFFLFVBQVUsQ0FBQyxnQ0FBRSxLQUFLLENBQUMsQ0FDMUIsZ0NBQUUsTUFBTSxDQUFDLGdDQUFFLEtBQUssQ0FBQyxnQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsZ0NBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUM3QyxrQ0FBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQ2pCLENBQUMsQ0FBQyxDQUFDO0NBQ0w7OztBQUVELElBQU0sVUFBVSxHQUFHLGdDQUFFLEtBQUssQ0FBQztBQUN6QixRQUFNLEVBQUUsZ0NBQUUsTUFBTSxFQUFFO0FBQ2xCLFVBQVEsRUFBRSxnQ0FBRSxNQUFNLEVBQUU7QUFDcEIsZ0JBQWMsRUFBRSxnQ0FBRSxNQUFNLEVBQUU7Q0FDM0IsQ0FBQyxDQUFDOzs7Ozs7O1dBV29CLE1BQU07Ozs7V0FDUjtBQUNqQixRQUFFLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQztBQUN4QixVQUFJLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQztBQUMxQixZQUFNLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQ3pDLFdBQUssRUFBRSxRQUFRLENBQUMsZ0NBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ3JDOzs7O0FBRVUsb0JBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTs7O0FBQzFCLGdDQUFNLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN0QixRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztHQUNqQjs7cUJBRUQsVUFBVSxHQUFBLHNCQUFHO1FBQ0gsTUFBTSxHQUFLLElBQUksQ0FBQyxLQUFL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Il9fdGVzdHNfXy9maXh0dXJlcy9Vc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFQgZnJvbSAndHlwZWNoZWNrLWRlY29yYXRvcic7XHJcblxyXG5pbXBvcnQgeyBtdWx0aUluamVjdCwgcHVyZSB9IGZyb20gJy4uLy4uLyc7XHJcblxyXG5mdW5jdGlvbiBwcm9wVHlwZShzY2hlbWEpIHtcclxuICByZXR1cm4gVC50b1Byb3BUeXBlKFQuc2hhcGUoW1xyXG4gICAgVC5vcHRpb24oVC5vbmVPZihULmV4YWN0bHkobnVsbCksIFQuRXJyb3IoKSkpLCAvLyBlcnJcclxuICAgIFQub3B0aW9uKHNjaGVtYSksIC8vIHJlc1xyXG4gIF0pKTtcclxufVxyXG5cclxuY29uc3QgdXNlclNjaGVtYSA9IFQuc2hhcGUoe1xyXG4gIHVzZXJJZDogVC5TdHJpbmcoKSxcclxuICB1c2VyTmFtZTogVC5TdHJpbmcoKSxcclxuICBwcm9maWxlUGljdHVyZTogVC5TdHJpbmcoKSxcclxufSk7XHJcblxyXG5AbXVsdGlJbmplY3QoKHsgdXNlcklkIH0sIHsgaHR0cCwgbG9jYWwgfSkgPT4gKHtcclxuICBtZTogaHR0cC5nZXQoYC9tZWAsIHtcclxuICAgIHF1ZXJ5OiB7IGF1dGhUb2tlbjogXy5sYXN0KGxvY2FsLnZhbHVlcygnL2F1dGhUb2tlbicpKSB9LFxyXG4gIH0pLFxyXG4gIHVzZXI6IGh0dHAuZ2V0KGAvdXNlcnMvJHt1c2VySWR9YCksXHJcbiAgdXNlcnM6IGh0dHAuZ2V0KGAvdXNlcnNgLCB7IHJlZnJlc2hFdmVyeTogNjAwMDAwIH0pLFxyXG59KSlcclxuQHB1cmVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdVc2VyJztcclxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgbWU6IHByb3BUeXBlKHVzZXJTY2hlbWEpLFxyXG4gICAgdXNlcjogcHJvcFR5cGUodXNlclNjaGVtYSksXHJcbiAgICB1c2VySWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIHVzZXJzOiBwcm9wVHlwZShULkFycmF5KHVzZXJTY2hlbWEpKSxcclxuICB9O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xyXG4gIH1cclxuXHJcbiAgZm9sbG93VXNlcigpIHtcclxuICAgIGNvbnN0IHsgdXNlcklkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgY29uc3QgeyBodHRwLCBsb2NhbCB9ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGZvbGxvd2luZzogaHR0cC5kaXNwYXRjaCgnZm9sbG93VXNlcicsIHtcclxuICAgICAgICB1c2VySWQsXHJcbiAgICAgICAgYXV0aFRva2VuOiBfLmxhc3QobG9jYWwudmFsdWVzKCcvYXV0aFRva2VuJykpLFxyXG4gICAgICB9KSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgcmV0dXJuIDxkaXY+XHJcbiAgICAgIHsoZXJyLCB1c2VycykgPT4ge1xyXG4gICAgICAgIGlmKCFlcnIgJiYgIXVzZXJzKSB7XHJcbiAgICAgICAgICByZXR1cm4gPHA+TG9hZGluZyB1c2Vycy4uLjwvcD47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGVycikge1xyXG4gICAgICAgICAgcmV0dXJuIDxwPntlcnIudG9TdHJpbmcoKX08L3A+O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gPHA+VG90YWwgdXNlcnM6IHt1c2Vycy5sZW5ndGh9PC9wPjtcclxuICAgICAgfSguLi50aGlzLnByb3BzLnVzZXJzKX1cclxuICAgICAgeyhlcnIsIHVzZXIpID0+IHtcclxuICAgICAgICBpZighZXJyICYmICF1c2VyKSB7XHJcbiAgICAgICAgICByZXR1cm4gPHA+TG9hZGluZyB1c2VyLi4uPC9wPjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICByZXR1cm4gPHA+e2Vyci50b1N0cmluZygpfTwvcD47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHsgdXNlck5hbWUsIHByb2ZpbGVQaWN0dXJlIH0gPSB1c2VyO1xyXG4gICAgICAgIHJldHVybiA8cD5cclxuICAgICAgICAgIFVzZXJuYW1lIHt1c2VyTmFtZX0gPGltZyBzcmM9e3Byb2ZpbGVQaWN0dXJlfSAvPlxyXG4gICAgICAgICAgeyh7IGZvbGxvd2luZyB9KSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFmb2xsb3dpbmcgfHwgZm9sbG93aW5nLmlzUGVuZGluZygpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIDxidXR0b24gb25DbGljaz17KCkgPT4gdGhpcy5mb2xsb3dVc2VyKCl9IGRpc2FibGVkPXtmb2xsb3dpbmcuaXNQZW5kaW5nKCl9PkZvbGxvdyB1c2VyPC9idXR0b24+O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKGZvbGxvd2luZy5pc1JlamVjdGVkKCkpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gPHA+e2ZvbGxvd2luZy5yZWFzb24oKS50b1N0cmluZygpfTwvcD47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIDxwPntmb2xsb3dpbmcudmFsdWUoKS50b1N0cmluZygpfTwvcD47XHJcbiAgICAgICAgICB9KHRoaXMuc3RhdGUpfVxyXG4gICAgICAgIDwvcD47XHJcbiAgICAgIH0oLi4udGhpcy5wcm9wcy51c2VyKX1cclxuICAgIDwvZGl2PjtcclxuICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
