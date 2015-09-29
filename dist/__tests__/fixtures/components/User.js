'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _typecheckDecorator = require('typecheck-decorator');

var _typecheckDecorator2 = _interopRequireDefault(_typecheckDecorator);

var _2 = require('../../../');

function propType(schema) {
  return _typecheckDecorator2['default'].toPropType(_typecheckDecorator2['default'].Array(_typecheckDecorator2['default'].shape([_typecheckDecorator2['default'].option(_typecheckDecorator2['default'].oneOf(_typecheckDecorator2['default'].exactly(null), _typecheckDecorator2['default'].Error())), // err
  _typecheckDecorator2['default'].option(schema)])));
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
      userId: _react2['default'].PropTypes.string.isRequired,
      users: propType(_typecheckDecorator2['default'].Array({ type: userSchema }))
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
      (function (_ref) {
        var err = _ref[0];
        var users = _ref[1];

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
      })(_lodash2['default'].last(this.props.users)),
      (function (_ref2) {
        var err = _ref2[0];
        var user = _ref2[1];

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
          (function (_ref3) {
            var following = _ref3.following;

            if (!following || following.isPending()) {
              return _react2['default'].createElement(
                'button',
                { onClick: function () {
                    return _this.followUser();
                  }, disabled: following && following.isPending() },
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
      })(_lodash2['default'].last(this.props.user))
    );
  };

  var _default2 = _default;
  _default = _2.pure(_default) || _default;
  _default = _2.multiInject(function (_ref4, _ref5) {
    var userId = _ref4.userId;
    var http = _ref5.http;
    return {
      me: http.get('/me', { query: { authToken: 'E47Exd7RdDds' } }),
      user: http.get('/users/' + userId),
      users: http.get('/users', { refreshEvery: 5000 }),
      error: http.get('/error')
    };
  })(_default) || _default;
  return _default;
})(_react2['default'].Component);

exports['default'] = _default;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fdGVzdHNfXy9maXh0dXJlcy9jb21wb25lbnRzL1VzZXIuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFBYyxRQUFROzs7O3FCQUNKLE9BQU87Ozs7a0NBQ1gscUJBQXFCOzs7O2lCQUVELFdBQVc7O0FBRTdDLFNBQVMsUUFBUSxDQUFDLE1BQU0sRUFBRTtBQUN4QixTQUFPLGdDQUFFLFVBQVUsQ0FBQyxnQ0FBRSxLQUFLLENBQUMsZ0NBQUUsS0FBSyxDQUFDLENBQ2xDLGdDQUFFLE1BQU0sQ0FBQyxnQ0FBRSxLQUFLLENBQUMsZ0NBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLGdDQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDN0Msa0NBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUNqQixDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ047OztBQUVELElBQU0sVUFBVSxHQUFHLGdDQUFFLEtBQUssQ0FBQztBQUN6QixRQUFNLEVBQUUsZ0NBQUUsTUFBTSxFQUFFO0FBQ2xCLFVBQVEsRUFBRSxnQ0FBRSxNQUFNLEVBQUU7QUFDcEIsZ0JBQWMsRUFBRSxnQ0FBRSxNQUFNLEVBQUU7Q0FDM0IsQ0FBQyxDQUFDOzs7Ozs7O1dBVW9CLE1BQU07Ozs7V0FDUjtBQUNqQixRQUFFLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQztBQUN4QixVQUFJLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQztBQUMxQixZQUFNLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQ3pDLFdBQUssRUFBRSxRQUFRLENBQUMsZ0NBQUUsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7S0FDL0M7Ozs7QUFFVSxvQkFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFOzs7QUFDMUIsZ0NBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0dBQ2pCOztx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QUMsR0FBRyxXQUFXLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDO0FBQ2pELFdBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztLQUMxQjtHQUFDLENBQUM7O0dBRTBCLG1CQUFNLFNBQVMiLCJmaWxlIjoiX190ZXN0c19fL2ZpeHR1cmVzL2NvbXBvbmVudHMvVXNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBUIGZyb20gJ3R5cGVjaGVjay1kZWNvcmF0b3InO1xyXG5cclxuaW1wb3J0IHsgbXVsdGlJbmplY3QsIHB1cmUgfSBmcm9tICcuLi8uLi8uLi8nO1xyXG5cclxuZnVuY3Rpb24gcHJvcFR5cGUoc2NoZW1hKSB7XHJcbiAgcmV0dXJuIFQudG9Qcm9wVHlwZShULkFycmF5KFQuc2hhcGUoW1xyXG4gICAgVC5vcHRpb24oVC5vbmVPZihULmV4YWN0bHkobnVsbCksIFQuRXJyb3IoKSkpLCAvLyBlcnJcclxuICAgIFQub3B0aW9uKHNjaGVtYSksIC8vIHJlc1xyXG4gIF0pKSk7XHJcbn1cclxuXHJcbmNvbnN0IHVzZXJTY2hlbWEgPSBULnNoYXBlKHtcclxuICB1c2VySWQ6IFQuU3RyaW5nKCksXHJcbiAgdXNlck5hbWU6IFQuU3RyaW5nKCksXHJcbiAgcHJvZmlsZVBpY3R1cmU6IFQuU3RyaW5nKCksXHJcbn0pO1xyXG5cclxuQG11bHRpSW5qZWN0KCh7IHVzZXJJZCB9LCB7IGh0dHAgfSkgPT4gKHtcclxuICBtZTogaHR0cC5nZXQoYC9tZWAsIHsgcXVlcnk6IHsgYXV0aFRva2VuOiAnRTQ3RXhkN1JkRGRzJyB9IH0pLFxyXG4gIHVzZXI6IGh0dHAuZ2V0KGAvdXNlcnMvJHt1c2VySWR9YCksXHJcbiAgdXNlcnM6IGh0dHAuZ2V0KGAvdXNlcnNgLCB7IHJlZnJlc2hFdmVyeTogNTAwMCB9KSxcclxuICBlcnJvcjogaHR0cC5nZXQoJy9lcnJvcicpLFxyXG59KSlcclxuQHB1cmVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdVc2VyJztcclxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgbWU6IHByb3BUeXBlKHVzZXJTY2hlbWEpLFxyXG4gICAgdXNlcjogcHJvcFR5cGUodXNlclNjaGVtYSksXHJcbiAgICB1c2VySWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgIHVzZXJzOiBwcm9wVHlwZShULkFycmF5KHsgdHlwZTogdXNlclNjaGVtYSB9KSksXHJcbiAgfTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcclxuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcclxuICAgIHRoaXMuc3RhdGUgPSB7fTtcclxuICB9XHJcblxyXG4gIGZvbGxvd1VzZXIoKSB7XHJcbiAgICBjb25zdCB7IHVzZXJJZCB9ID0gdGhpcy5wcm9wcztcclxuICAgIGNvbnN0IHsgaHR0cCwgbG9jYWwgfSA9IHRoaXMuY29udGV4dDtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBmb2xsb3dpbmc6IGh0dHAuZGlzcGF0Y2goJ2ZvbGxvd1VzZXInLCB7XHJcbiAgICAgICAgdXNlcklkLFxyXG4gICAgICAgIGF1dGhUb2tlbjogXy5sYXN0KGxvY2FsLnZhbHVlcygnL2F1dGhUb2tlbicpKSxcclxuICAgICAgfSksXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHJldHVybiA8ZGl2PlxyXG4gICAgICB7KFtlcnIsIHVzZXJzXSkgPT4ge1xyXG4gICAgICAgIGlmKCFlcnIgJiYgIXVzZXJzKSB7XHJcbiAgICAgICAgICByZXR1cm4gPHA+TG9hZGluZyB1c2Vycy4uLjwvcD47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGVycikge1xyXG4gICAgICAgICAgcmV0dXJuIDxwPntlcnIudG9TdHJpbmcoKX08L3A+O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gPHA+VG90YWwgdXNlcnM6IHt1c2Vycy5sZW5ndGh9PC9wPjtcclxuICAgICAgfShfLmxhc3QodGhpcy5wcm9wcy51c2VycykpfVxyXG4gICAgICB7KFtlcnIsIHVzZXJdKSA9PiB7XHJcbiAgICAgICAgaWYoIWVyciAmJiAhdXNlcikge1xyXG4gICAgICAgICAgcmV0dXJuIDxwPkxvYWRpbmcgdXNlci4uLjwvcD47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGVycikge1xyXG4gICAgICAgICAgcmV0dXJuIDxwPntlcnIudG9TdHJpbmcoKX08L3A+O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB7IHVzZXJOYW1lLCBwcm9maWxlUGljdHVyZSB9ID0gdXNlcjtcclxuICAgICAgICByZXR1cm4gPHA+XHJcbiAgICAgICAgICBVc2VybmFtZSB7dXNlck5hbWV9IDxpbWcgc3JjPXtwcm9maWxlUGljdHVyZX0gLz5cclxuICAgICAgICAgIHsoeyBmb2xsb3dpbmcgfSkgPT4ge1xyXG4gICAgICAgICAgICBpZighZm9sbG93aW5nIHx8IGZvbGxvd2luZy5pc1BlbmRpbmcoKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHRoaXMuZm9sbG93VXNlcigpfSBkaXNhYmxlZD17Zm9sbG93aW5nICYmIGZvbGxvd2luZy5pc1BlbmRpbmcoKX0+XHJcbiAgICAgICAgICAgICAgICBGb2xsb3cgdXNlclxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihmb2xsb3dpbmcuaXNSZWplY3RlZCgpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIDxwPntmb2xsb3dpbmcucmVhc29uKCkudG9TdHJpbmcoKX08L3A+O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiA8cD57Zm9sbG93aW5nLnZhbHVlKCkudG9TdHJpbmcoKX08L3A+O1xyXG4gICAgICAgICAgfSh0aGlzLnN0YXRlKX1cclxuICAgICAgICA8L3A+O1xyXG4gICAgICB9KF8ubGFzdCh0aGlzLnByb3BzLnVzZXIpKX1cclxuICAgIDwvZGl2PjtcclxuICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
