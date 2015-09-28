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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fdGVzdHNfXy9maXh0dXJlcy9Vc2VyLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7c0JBQWMsUUFBUTs7OztxQkFDSixPQUFPOzs7O2tDQUNYLHFCQUFxQjs7OztpQkFFTyxRQUFROztBQUVsRCxTQUFTLFFBQVEsQ0FBQyxNQUFNLEVBQUU7QUFDeEIsU0FBTyxnQ0FBRSxVQUFVLENBQUMsZ0NBQUUsS0FBSyxDQUFDLENBQzFCLGdDQUFFLE1BQU0sQ0FBQyxnQ0FBRSxLQUFLLENBQUMsZ0NBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLGdDQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDN0Msa0NBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUNqQixDQUFDLENBQUMsQ0FBQztDQUNMOzs7QUFFRCxJQUFNLFVBQVUsR0FBRyxnQ0FBRSxLQUFLLENBQUM7QUFDekIsUUFBTSxFQUFFLGdDQUFFLE1BQU0sRUFBRTtBQUNsQixVQUFRLEVBQUUsZ0NBQUUsTUFBTSxFQUFFO0FBQ3BCLGdCQUFjLEVBQUUsZ0NBQUUsTUFBTSxFQUFFO0NBQzNCLENBQUMsQ0FBQzs7Ozs7OztXQVVvQixNQUFNOzs7O1dBQ1I7QUFDakIsUUFBRSxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUM7QUFDeEIsVUFBSSxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUM7QUFDMUIsWUFBTSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVTtBQUN6QyxXQUFLLEVBQUUsUUFBUSxDQUFDLGdDQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUNyQzs7OztBQUVVLG9CQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7OztBQUMxQixnQ0FBTSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDdEIsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7R0FDakI7O3FCQUVELFVBQVUsR0FBQSxzQkFBRztRQUNILE1BQU0sR0FBSyxJQUFJLENBQUMsS0FBSyxD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RUFBRSxLQUFTO1FBQVAsS0FBSyxHQUFQLEtBQVMsQ0FBUCxLQUFLO1dBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7R0FBQSxDQUFDOztHQU90QyxtQkFBTSxTQUFTIiwiZmlsZSI6Il9fdGVzdHNfXy9maXh0dXJlcy9Vc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFQgZnJvbSAndHlwZWNoZWNrLWRlY29yYXRvcic7XHJcblxyXG5pbXBvcnQgeyBpbmplY3QsIG11bHRpSW5qZWN0LCBwdXJlIH0gZnJvbSAnLi4vLi4vJztcclxuXHJcbmZ1bmN0aW9uIHByb3BUeXBlKHNjaGVtYSkge1xyXG4gIHJldHVybiBULnRvUHJvcFR5cGUoVC5zaGFwZShbXHJcbiAgICBULm9wdGlvbihULm9uZU9mKFQuZXhhY3RseShudWxsKSwgVC5FcnJvcigpKSksIC8vIGVyclxyXG4gICAgVC5vcHRpb24oc2NoZW1hKSwgLy8gcmVzXHJcbiAgXSkpO1xyXG59XHJcblxyXG5jb25zdCB1c2VyU2NoZW1hID0gVC5zaGFwZSh7XHJcbiAgdXNlcklkOiBULlN0cmluZygpLFxyXG4gIHVzZXJOYW1lOiBULlN0cmluZygpLFxyXG4gIHByb2ZpbGVQaWN0dXJlOiBULlN0cmluZygpLFxyXG59KTtcclxuXHJcbkBpbmplY3QoJ2F1dGhUb2tlbicsIChwcm9wcywgeyBsb2NhbCB9KSA9PiBsb2NhbC5nZXQoJy9hdXRoVG9rZW4nKSlcclxuQG11bHRpSW5qZWN0KCh7IHVzZXJJZCwgYXV0aFRva2VuIH0sIHsgaHR0cCB9KSA9PiAoe1xyXG4gIG1lOiBodHRwLmdldChgL21lYCwgeyBxdWVyeTogeyBhdXRoVG9rZW4gfSB9KSxcclxuICB1c2VyOiBodHRwLmdldChgL3VzZXJzLyR7dXNlcklkfWApLFxyXG4gIHVzZXJzOiBodHRwLmdldChgL3VzZXJzYCwgeyByZWZyZXNoRXZlcnk6IDUwMDAgfSksXHJcbn0pKVxyXG5AcHVyZVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ1VzZXInO1xyXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICBtZTogcHJvcFR5cGUodXNlclNjaGVtYSksXHJcbiAgICB1c2VyOiBwcm9wVHlwZSh1c2VyU2NoZW1hKSxcclxuICAgIHVzZXJJZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG4gICAgdXNlcnM6IHByb3BUeXBlKFQuQXJyYXkodXNlclNjaGVtYSkpLFxyXG4gIH07XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XHJcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XHJcbiAgICB0aGlzLnN0YXRlID0ge307XHJcbiAgfVxyXG5cclxuICBmb2xsb3dVc2VyKCkge1xyXG4gICAgY29uc3QgeyB1c2VySWQgfSA9IHRoaXMucHJvcHM7XHJcbiAgICBjb25zdCB7IGh0dHAsIGxvY2FsIH0gPSB0aGlzLmNvbnRleHQ7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgZm9sbG93aW5nOiBodHRwLmRpc3BhdGNoKCdmb2xsb3dVc2VyJywge1xyXG4gICAgICAgIHVzZXJJZCxcclxuICAgICAgICBhdXRoVG9rZW46IF8ubGFzdChsb2NhbC52YWx1ZXMoJy9hdXRoVG9rZW4nKSksXHJcbiAgICAgIH0pLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gPGRpdj5cclxuICAgICAgeyhlcnIsIHVzZXJzKSA9PiB7XHJcbiAgICAgICAgaWYoIWVyciAmJiAhdXNlcnMpIHtcclxuICAgICAgICAgIHJldHVybiA8cD5Mb2FkaW5nIHVzZXJzLi4uPC9wPjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICByZXR1cm4gPHA+e2Vyci50b1N0cmluZygpfTwvcD47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiA8cD5Ub3RhbCB1c2Vyczoge3VzZXJzLmxlbmd0aH08L3A+O1xyXG4gICAgICB9KF8ubGFzdCh0aGlzLnByb3BzLnVzZXJzKSl9XHJcbiAgICAgIHsoZXJyLCB1c2VyKSA9PiB7XHJcbiAgICAgICAgaWYoIWVyciAmJiAhdXNlcikge1xyXG4gICAgICAgICAgcmV0dXJuIDxwPkxvYWRpbmcgdXNlci4uLjwvcD47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGVycikge1xyXG4gICAgICAgICAgcmV0dXJuIDxwPntlcnIudG9TdHJpbmcoKX08L3A+O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB7IHVzZXJOYW1lLCBwcm9maWxlUGljdHVyZSB9ID0gdXNlcjtcclxuICAgICAgICByZXR1cm4gPHA+XHJcbiAgICAgICAgICBVc2VybmFtZSB7dXNlck5hbWV9IDxpbWcgc3JjPXtwcm9maWxlUGljdHVyZX0gLz5cclxuICAgICAgICAgIHsoeyBmb2xsb3dpbmcgfSkgPT4ge1xyXG4gICAgICAgICAgICBpZighZm9sbG93aW5nIHx8IGZvbGxvd2luZy5pc1BlbmRpbmcoKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHRoaXMuZm9sbG93VXNlcigpfSBkaXNhYmxlZD17Zm9sbG93aW5nLmlzUGVuZGluZygpfT5Gb2xsb3cgdXNlcjwvYnV0dG9uPjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihmb2xsb3dpbmcuaXNSZWplY3RlZCgpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIDxwPntmb2xsb3dpbmcucmVhc29uKCkudG9TdHJpbmcoKX08L3A+O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiA8cD57Zm9sbG93aW5nLnZhbHVlKCkudG9TdHJpbmcoKX08L3A+O1xyXG4gICAgICAgICAgfSh0aGlzLnN0YXRlKX1cclxuICAgICAgICA8L3A+O1xyXG4gICAgICB9KF8ubGFzdCh0aGlzLnByb3BzLnVzZXIpKX1cclxuICAgIDwvZGl2PjtcclxuICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
