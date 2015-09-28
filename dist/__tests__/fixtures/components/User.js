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
      })(_lodash2['default'].last(this.props.users)),
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
      })(_lodash2['default'].last(this.props.user))
    );
  };

  var _default2 = _default;
  _default = _2.pure(_default) || _default;
  _default = _2.multiInject(function (_ref2, _ref3) {
    var userId = _ref2.userId;
    var authToken = _ref2.authToken;
    var http = _ref3.http;
    return {
      me: http.get('/me', { query: { authToken: authToken } }),
      user: http.get('/users/' + userId),
      users: http.get('/users', { refreshEvery: 5000 })
    };
  })(_default) || _default;
  _default = _2.inject('authToken', function (props, _ref4) {
    var local = _ref4.local;
    return local.get('/authToken');
  })(_default) || _default;
  return _default;
})(_react2['default'].Component);

exports['default'] = _default;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fdGVzdHNfXy9maXh0dXJlcy9jb21wb25lbnRzL1VzZXIuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFBYyxRQUFROzs7O3FCQUNKLE9BQU87Ozs7a0NBQ1gscUJBQXFCOzs7O2lCQUVPLFdBQVc7O0FBRXJELFNBQVMsUUFBUSxDQUFDLE1BQU0sRUFBRTtBQUN4QixTQUFPLGdDQUFFLFVBQVUsQ0FBQyxnQ0FBRSxLQUFLLENBQUMsQ0FDMUIsZ0NBQUUsTUFBTSxDQUFDLGdDQUFFLEtBQUssQ0FBQyxnQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsZ0NBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUM3QyxrQ0FBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQ2pCLENBQUMsQ0FBQyxDQUFDO0NBQ0w7OztBQUVELElBQU0sVUFBVSxHQUFHLGdDQUFFLEtBQUssQ0FBQztBQUN6QixRQUFNLEVBQUUsZ0NBQUUsTUFBTSxFQUFFO0FBQ2xCLFVBQVEsRUFBRSxnQ0FBRSxNQUFNLEVBQUU7QUFDcEIsZ0JBQWMsRUFBRSxnQ0FBRSxNQUFNLEVBQUU7Q0FDM0IsQ0FBQyxDQUFDOzs7Ozs7O1dBVW9CLE1BQU07Ozs7V0FDUjtBQUNqQixRQUFFLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQztBQUN4QixVQUFJLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQztBQUMxQixZQUFNLEVBQUUsbUJBQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQ3pDLFdBQUssRUFBRSxRQUFRLENBQUMsZ0NBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ3JDOzs7O0FBRVUsb0JBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTs7O0FBQzFCLGdDQUFNLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN0QixRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztHQUNqQjs7cUJBRUQsVUFBVSxHQUFBLHNCQUFHO1FBQ0gsTUFBTSxHQUFLLElBQUksQ0FBQyxLQUFLLENBQXJCLE1BQU07bUJBQ1UsSUFBSSxDQUFDLE9BQU87UUFBNUIsSUFBSSxZQUFKLElBQUk7UUFBRSxLQUFLLFlBQUwsS0FBSzs7QUFDbkIsUUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNaLGVBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRTtBQUNyQyxjQUFNLEVBQU4sTUFBTTtBQUNOLGlCQUFTLEVBQUUsb0JBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDOUMsQ0FBQztLQUNILENBQUMsQ0FBQztHQUNKOztxQkFFRCxNQUFNLEdBQUEsa0JBQUc7OztBQUNQLFdBQU87OztNQUNKLENBQUEsVUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFLO0FBQ2YsWUFBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNqQixpQkFBTzs7OztXQUF1QixDQUFDO1NBQ2hDO0FBQ0QsWUFBRyxHQUFHLEVBQUU7QUFDTixpQkFBTzs7O1lBQUksR0FBRyxDQUFDLFFBQVEsRUFBRTtXQUFLLENBQUM7U0FDaEM7QUFDRCxlQUFPOzs7O1VBQWlCLEtBQUssQ0FBQyxNQUFNO1NBQUssQ0FBQztPQUMzQyxDQUFBLENBQUMsb0JBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDMUIsQ0FBQSxVQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUs7QUFDZCxZQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2hCLGlCQUFPOzs7O1dBQXNCLENBQUM7U0FDL0I7QUFDRCxZQUFHLEdBQUcsRUFBRTtBQUNOLGlCQUFPOzs7WUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFO1dBQUssQ0FBQztTQUNoQztZQUNPLFFBQVEsR0FBcUIsSUFBSSxDQUFqQyxRQUFRO1lBQUUsY0FBYyxHQUFLLElBQUksQ0FBdkIsY0FBYzs7QUFDaEMsZUFBTzs7OztVQUNLLFFBQVE7O1VBQUUsMENBQUssR0FBRyxFQUFFLGNBQWMsQUFBQyxHQUFHO1VBQy9DLENBQUEsVUFBQyxJQUFhLEVBQUs7Z0JBQWhCLFNBQVMsR0FBWCxJQUFhLENBQVgsU0FBUzs7QUFDWCxnQkFBRyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsU0FBUyxFQUFFLEVBQUU7QUFDdEMscUJBQU87O2tCQUFRLE9BQU8sRUFBRTsyQkFBTSxNQUFLLFVBQVUsRUFBRTttQkFBQSxBQUFDLEVBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQUFBQzs7ZUFBcUIsQ0FBQzthQUN4RztBQUNELGdCQUFHLFNBQVMsQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUN6QixxQkFBTzs7O2dCQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7ZUFBSyxDQUFDO2FBQy9DO0FBQ0QsbUJBQU87OztjQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFRLEVBQUU7YUFBSyxDQUFDO1dBQzlDLENBQUEsQ0FBQyxNQUFLLEtBQUssQ0FBQztTQUNYLENBQUM7T0FDTixDQUFBLENBQUMsb0JBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdEIsQ0FBQztHQUNSOzs7O2FBaEVGLGVBQVksVUFBQyxLQUFxQixFQUFFLEtBQVE7UUFBN0IsTUFBTSxHQUFSLEtBQXFCLENBQW5CLE1BQU07UUFBRSxTQUFTLEdBQW5CLEtBQXFCLENBQVgsU0FBUztRQUFNLElBQUksR0FBTixLQUFRLENBQU4sSUFBSTtXQUFRO0FBQ2pELFFBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFULFNBQVMsRUFBRSxFQUFFLENBQUM7QUFDN0MsVUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLGFBQVcsTUFBTSxDQUFHO0FBQ2xDLFdBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxXQUFXLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDO0tBQ2xEO0dBQUMsQ0FBQzthQUxGLFVBQU8sV0FBVyxFQUFFLFVBQUMsS0FBSyxFQUFFLEtBQVM7UUFBUCxLQUFLLEdBQVAsS0FBUyxDQUFQLEtBQUs7V0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztHQUFBLENBQUM7O0dBT3RDLG1CQUFNLFNBQVMiLCJmaWxlIjoiX190ZXN0c19fL2ZpeHR1cmVzL2NvbXBvbmVudHMvVXNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBUIGZyb20gJ3R5cGVjaGVjay1kZWNvcmF0b3InO1xyXG5cclxuaW1wb3J0IHsgaW5qZWN0LCBtdWx0aUluamVjdCwgcHVyZSB9IGZyb20gJy4uLy4uLy4uLyc7XHJcblxyXG5mdW5jdGlvbiBwcm9wVHlwZShzY2hlbWEpIHtcclxuICByZXR1cm4gVC50b1Byb3BUeXBlKFQuc2hhcGUoW1xyXG4gICAgVC5vcHRpb24oVC5vbmVPZihULmV4YWN0bHkobnVsbCksIFQuRXJyb3IoKSkpLCAvLyBlcnJcclxuICAgIFQub3B0aW9uKHNjaGVtYSksIC8vIHJlc1xyXG4gIF0pKTtcclxufVxyXG5cclxuY29uc3QgdXNlclNjaGVtYSA9IFQuc2hhcGUoe1xyXG4gIHVzZXJJZDogVC5TdHJpbmcoKSxcclxuICB1c2VyTmFtZTogVC5TdHJpbmcoKSxcclxuICBwcm9maWxlUGljdHVyZTogVC5TdHJpbmcoKSxcclxufSk7XHJcblxyXG5AaW5qZWN0KCdhdXRoVG9rZW4nLCAocHJvcHMsIHsgbG9jYWwgfSkgPT4gbG9jYWwuZ2V0KCcvYXV0aFRva2VuJykpXHJcbkBtdWx0aUluamVjdCgoeyB1c2VySWQsIGF1dGhUb2tlbiB9LCB7IGh0dHAgfSkgPT4gKHtcclxuICBtZTogaHR0cC5nZXQoYC9tZWAsIHsgcXVlcnk6IHsgYXV0aFRva2VuIH0gfSksXHJcbiAgdXNlcjogaHR0cC5nZXQoYC91c2Vycy8ke3VzZXJJZH1gKSxcclxuICB1c2VyczogaHR0cC5nZXQoYC91c2Vyc2AsIHsgcmVmcmVzaEV2ZXJ5OiA1MDAwIH0pLFxyXG59KSlcclxuQHB1cmVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdVc2VyJztcclxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgbWU6IHByb3BUeXBlKHVzZXJTY2hlbWEpLFxyXG4gICAgdXNlcjogcHJvcFR5cGUodXNlclNjaGVtYSksXHJcbiAgICB1c2VySWQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcclxuICAgIHVzZXJzOiBwcm9wVHlwZShULkFycmF5KHVzZXJTY2hlbWEpKSxcclxuICB9O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xyXG4gIH1cclxuXHJcbiAgZm9sbG93VXNlcigpIHtcclxuICAgIGNvbnN0IHsgdXNlcklkIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgY29uc3QgeyBodHRwLCBsb2NhbCB9ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGZvbGxvd2luZzogaHR0cC5kaXNwYXRjaCgnZm9sbG93VXNlcicsIHtcclxuICAgICAgICB1c2VySWQsXHJcbiAgICAgICAgYXV0aFRva2VuOiBfLmxhc3QobG9jYWwudmFsdWVzKCcvYXV0aFRva2VuJykpLFxyXG4gICAgICB9KSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgcmV0dXJuIDxkaXY+XHJcbiAgICAgIHsoZXJyLCB1c2VycykgPT4ge1xyXG4gICAgICAgIGlmKCFlcnIgJiYgIXVzZXJzKSB7XHJcbiAgICAgICAgICByZXR1cm4gPHA+TG9hZGluZyB1c2Vycy4uLjwvcD47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGVycikge1xyXG4gICAgICAgICAgcmV0dXJuIDxwPntlcnIudG9TdHJpbmcoKX08L3A+O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gPHA+VG90YWwgdXNlcnM6IHt1c2Vycy5sZW5ndGh9PC9wPjtcclxuICAgICAgfShfLmxhc3QodGhpcy5wcm9wcy51c2VycykpfVxyXG4gICAgICB7KGVyciwgdXNlcikgPT4ge1xyXG4gICAgICAgIGlmKCFlcnIgJiYgIXVzZXIpIHtcclxuICAgICAgICAgIHJldHVybiA8cD5Mb2FkaW5nIHVzZXIuLi48L3A+O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihlcnIpIHtcclxuICAgICAgICAgIHJldHVybiA8cD57ZXJyLnRvU3RyaW5nKCl9PC9wPjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgeyB1c2VyTmFtZSwgcHJvZmlsZVBpY3R1cmUgfSA9IHVzZXI7XHJcbiAgICAgICAgcmV0dXJuIDxwPlxyXG4gICAgICAgICAgVXNlcm5hbWUge3VzZXJOYW1lfSA8aW1nIHNyYz17cHJvZmlsZVBpY3R1cmV9IC8+XHJcbiAgICAgICAgICB7KHsgZm9sbG93aW5nIH0pID0+IHtcclxuICAgICAgICAgICAgaWYoIWZvbGxvd2luZyB8fCBmb2xsb3dpbmcuaXNQZW5kaW5nKCkpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB0aGlzLmZvbGxvd1VzZXIoKX0gZGlzYWJsZWQ9e2ZvbGxvd2luZy5pc1BlbmRpbmcoKX0+Rm9sbG93IHVzZXI8L2J1dHRvbj47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoZm9sbG93aW5nLmlzUmVqZWN0ZWQoKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiA8cD57Zm9sbG93aW5nLnJlYXNvbigpLnRvU3RyaW5nKCl9PC9wPjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gPHA+e2ZvbGxvd2luZy52YWx1ZSgpLnRvU3RyaW5nKCl9PC9wPjtcclxuICAgICAgICAgIH0odGhpcy5zdGF0ZSl9XHJcbiAgICAgICAgPC9wPjtcclxuICAgICAgfShfLmxhc3QodGhpcy5wcm9wcy51c2VyKSl9XHJcbiAgICA8L2Rpdj47XHJcbiAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
