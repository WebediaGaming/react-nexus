'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _typecheckDecorator = require('typecheck-decorator');

var _typecheckDecorator2 = _interopRequireDefault(_typecheckDecorator);

var _ = require('../../../');

// Helper components

function Users(_ref) {
  var users = _ref.users;

  if (_.isPending(users)) {
    return _react2['default'].createElement(
      'p',
      null,
      'Loading users...'
    );
  }

  var err = _.lastErrorOf(users);

  var val = _.lastValueOf(users);

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
    val.length
  );
}

function UserProfile(_ref2) {
  var user = _ref2.user;
  var following = _ref2.following;
  var followUser = _ref2.followUser;

  if (_.isPending(user)) {
    return _react2['default'].createElement(
      'p',
      null,
      'Loading user...'
    );
  }

  var err = _.lastErrorOf(user);

  var val = _.lastValueOf(user);

  if (err) {
    return _react2['default'].createElement(
      'p',
      null,
      err.toString()
    );
  }
  var userName = val.userName;
  var profilePicture = val.profilePicture;

  return _react2['default'].createElement(
    'p',
    null,
    'Username ',
    userName,
    ' ',
    _react2['default'].createElement('img', { src: profilePicture }),
    _react2['default'].createElement(FollowButton, { following: following, onClick: followUser })
  );
}

function FollowButton(_ref3) {
  var following = _ref3.following;
  var onClick = _ref3.onClick;

  if (!following || following.isPending()) {
    return _react2['default'].createElement(
      'button',
      { onClick: onClick, disabled: following && following.isPending() },
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
}

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

var User = (function (_React$Component) {
  _inherits(User, _React$Component);

  _createClass(User, null, [{
    key: 'displayName',
    value: 'User',
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      authToken: propType(_typecheckDecorator2['default'].String()),
      fontSize: propType(_typecheckDecorator2['default'].oneOf(_typecheckDecorator2['default'].String(), _typecheckDecorator2['default'].Number())),
      me: propType(userSchema),
      user: propType(userSchema),
      userId: _react2['default'].PropTypes.string.isRequired,
      users: propType(_typecheckDecorator2['default'].Array({ type: userSchema }))
    },
    enumerable: true
  }]);

  function User(props, context) {
    _classCallCheck(this, _User);

    _React$Component.call(this, props, context);
    this.state = {};
  }

  User.prototype.followUser = function followUser() {
    var _props = this.props;
    var userId = _props.userId;
    var authToken = _props.authToken;
    var http = this.context[_.$nexus].http;

    this.setState({
      following: http.dispatch('follow user', {
        userId: _.lastValueOf(userId),
        authToken: _.lastValueOf(authToken)
      })
    });
  };

  User.prototype.updateFontSize = function updateFontSize(e) {
    e.preventDefault();
    var local = this.context[_.$nexus].local;

    local.dispatch('set font size', { fontSize: e.target.value });
  };

  User.prototype.render = function render() {
    var _this = this;

    var _props2 = this.props;
    var fontSize = _props2.fontSize;
    var users = _props2.users;
    var user = _props2.user;
    var following = this.state.following;

    return _react2['default'].createElement(
      'div',
      { style: { fontSize: _.lastValueOf(fontSize) } },
      _react2['default'].createElement(Users, { users: users }),
      _react2['default'].createElement(UserProfile, { user: user, following: following, followUser: function () {
          return _this.followUser();
        } }),
      _react2['default'].createElement(
        'div',
        null,
        'modify font size:',
        _react2['default'].createElement('input', { type: 'text', onChange: function (e) {
            return _this.updateFontSize(e);
          }, value: _.lastValueOf(fontSize) })
      )
    );
  };

  var _User = User;
  User = _.pure(User) || User;
  User = _.multiInject(function (_ref4, _ref5) {
    var userId = _ref4.userId;
    var authToken = _ref4.authToken;
    var http = _ref5.http;
    var local = _ref5.local;
    return {
      authToken: local.get('/authToken'),
      error: http.get('/error'),
      fontSize: local.get('/fontSize'),
      me: http.get('/me', { query: { authToken: _.lastValueOf(authToken) } }),
      user: http.get('/users/' + userId),
      users: http.get('/users', { refreshEvery: 5000 })
    };
  })(User) || User;
  User = _.inject('authToken', function (props, _ref6) {
    var local = _ref6.local;
    return local.get('/authToken');
  })(User) || User;
  return User;
})(_react2['default'].Component);

exports['default'] = User;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fdGVzdHNfXy9maXh0dXJlcy9jb21wb25lbnRzL1VzZXIuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztxQkFBa0IsT0FBTzs7OztrQ0FDWCxxQkFBcUI7Ozs7Z0JBRW9ELFdBQVc7Ozs7QUFJbEcsU0FBUyxLQUFLLENBQUMsSUFBUyxFQUFFO01BQVQsS0FBSyxHQUFQLElBQVMsQ0FBUCxLQUFLOztBQUNwQixNQUFHLFlBQVUsS0FBSyxDQUFDLEVBQUU7QUFDbkIsV0FBTzs7OztLQUF1QixDQUFDO0dBQ2hDOztNQUNNLEdBQUcsR0FBVSxjQUFZLEtBQUssQ0FBQzs7TUFBMUIsR0FBRyxHQUF5QixjQUFZLEtBQUssQ0FBQzs7QUFDMUQsTUFBRyxHQUFHLEVBQUU7QUFDTixXQUFPOzs7TUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFO0tBQUssQ0FBQztHQUNoQztBQUNELFNBQU87Ozs7SUFBaUIsR0FBRyxDQUFDLE1BQU07R0FBSyxDQUFDO0NBQ3pDOztBQUVELFNBQVMsV0FBVyxDQUFDLEtBQStCLEVBQUU7TUFBL0IsSUFBSSxHQUFOLEtBQStCLENBQTdCLElBQUk7TUFBRSxTQUFTLEdBQWpCLEtBQStCLENBQXZCLFNBQVM7TUFBRSxVQUFVLEdBQTdCLEtBQStCLENBQVosVUFBVTs7QUFDaEQsTUFBRyxZQUFVLElBQUksQ0FBQyxFQUFFO0FBQ2xCLFdBQU87Ozs7S0FBc0IsQ0FBQztHQUMvQjs7TUFDTSxHQUFHLEdBQVUsY0FBWSxJQUFJLENBQUM7O01BQXpCLEdBQUcsR0FBd0IsY0FBWSxJQUFJLENBQUM7O0FBQ3hELE1BQUcsR0FBRyxFQUFFO0FBQ04sV0FBTzs7O01BQUksR0FBRyxDQUFDLFFBQVEsRUFBRTtLQUFLLENBQUM7R0FDaEM7TUFDTyxRQUFRLEdBQXFCLEdBQUcsQ0FBaEMsUUFBUTtNQUFFLGNBQWMsR0FBSyxHQUFHLENBQXRCLGNBQWM7O0FBQ2hDLFNBQU87Ozs7SUFDSyxRQUFROztJQUFFLDBDQUFLLEdBQUcsRUFB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LENBQWIsSUFBSTtRQUFFLEtBQUssR0FBYixLQUFlLENBQVAsS0FBSztXQUFRO0FBQ3hELGVBQVMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztBQUNsQyxXQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDekIsY0FBUSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO0FBQ2hDLFFBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLGNBQVksU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ3JFLFVBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxhQUFXLE1BQU0sQ0FBRztBQUNsQyxXQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsV0FBVyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQztLQUNsRDtHQUFDLENBQUMsQ0FFa0IsSUFBSSxLQUFKLElBQUk7QUFBSixNQUFJLEdBVnhCLFNBQU8sV0FBVyxFQUFFLFVBQUMsS0FBSyxFQUFFLEtBQVM7UUFBUCxLQUFLLEdBQVAsS0FBUyxDQUFQLEtBQUs7V0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztHQUFBLENBQUMsQ0FVOUMsSUFBSSxLQUFKLElBQUk7U0FBSixJQUFJO0dBQVMsbUJBQU0sU0FBUzs7cUJBQTVCLElBQUkiLCJmaWxlIjoiX190ZXN0c19fL2ZpeHR1cmVzL2NvbXBvbmVudHMvVXNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBUIGZyb20gJ3R5cGVjaGVjay1kZWNvcmF0b3InO1xyXG5cclxuaW1wb3J0IHsgaW5qZWN0LCBtdWx0aUluamVjdCwgcHVyZSwgJG5leHVzLCBpc1BlbmRpbmcsIGxhc3RFcnJvck9mLCBsYXN0VmFsdWVPZiB9IGZyb20gJy4uLy4uLy4uLyc7XHJcblxyXG4vLyBIZWxwZXIgY29tcG9uZW50c1xyXG5cclxuZnVuY3Rpb24gVXNlcnMoeyB1c2VycyB9KSB7XHJcbiAgaWYoaXNQZW5kaW5nKHVzZXJzKSkge1xyXG4gICAgcmV0dXJuIDxwPkxvYWRpbmcgdXNlcnMuLi48L3A+O1xyXG4gIH1cclxuICBjb25zdCBbZXJyLCB2YWxdID0gW2xhc3RFcnJvck9mKHVzZXJzKSwgbGFzdFZhbHVlT2YodXNlcnMpXTtcclxuICBpZihlcnIpIHtcclxuICAgIHJldHVybiA8cD57ZXJyLnRvU3RyaW5nKCl9PC9wPjtcclxuICB9XHJcbiAgcmV0dXJuIDxwPlRvdGFsIHVzZXJzOiB7dmFsLmxlbmd0aH08L3A+O1xyXG59XHJcblxyXG5mdW5jdGlvbiBVc2VyUHJvZmlsZSh7IHVzZXIsIGZvbGxvd2luZywgZm9sbG93VXNlciB9KSB7XHJcbiAgaWYoaXNQZW5kaW5nKHVzZXIpKSB7XHJcbiAgICByZXR1cm4gPHA+TG9hZGluZyB1c2VyLi4uPC9wPjtcclxuICB9XHJcbiAgY29uc3QgW2VyciwgdmFsXSA9IFtsYXN0RXJyb3JPZih1c2VyKSwgbGFzdFZhbHVlT2YodXNlcildO1xyXG4gIGlmKGVycikge1xyXG4gICAgcmV0dXJuIDxwPntlcnIudG9TdHJpbmcoKX08L3A+O1xyXG4gIH1cclxuICBjb25zdCB7IHVzZXJOYW1lLCBwcm9maWxlUGljdHVyZSB9ID0gdmFsO1xyXG4gIHJldHVybiA8cD5cclxuICAgIFVzZXJuYW1lIHt1c2VyTmFtZX0gPGltZyBzcmM9e3Byb2ZpbGVQaWN0dXJlfSAvPlxyXG4gICAgPEZvbGxvd0J1dHRvbiBmb2xsb3dpbmc9e2ZvbGxvd2luZ30gb25DbGljaz17Zm9sbG93VXNlcn0gLz5cclxuICA8L3A+O1xyXG59XHJcblxyXG5mdW5jdGlvbiBGb2xsb3dCdXR0b24oeyBmb2xsb3dpbmcsIG9uQ2xpY2sgfSkge1xyXG4gIGlmKCFmb2xsb3dpbmcgfHwgZm9sbG93aW5nLmlzUGVuZGluZygpKSB7XHJcbiAgICByZXR1cm4gPGJ1dHRvbiBvbkNsaWNrPXtvbkNsaWNrfSBkaXNhYmxlZD17Zm9sbG93aW5nICYmIGZvbGxvd2luZy5pc1BlbmRpbmcoKX0+XHJcbiAgICAgIEZvbGxvdyB1c2VyXHJcbiAgICA8L2J1dHRvbj47XHJcbiAgfVxyXG4gIGlmKGZvbGxvd2luZy5pc1JlamVjdGVkKCkpIHtcclxuICAgIHJldHVybiA8cD57Zm9sbG93aW5nLnJlYXNvbigpLnRvU3RyaW5nKCl9PC9wPjtcclxuICB9XHJcbiAgcmV0dXJuIDxwPntmb2xsb3dpbmcudmFsdWUoKS50b1N0cmluZygpfTwvcD47XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb3BUeXBlKHNjaGVtYSkge1xyXG4gIHJldHVybiBULnRvUHJvcFR5cGUoVC5BcnJheShULnNoYXBlKFtcclxuICAgIFQub3B0aW9uKFQub25lT2YoVC5leGFjdGx5KG51bGwpLCBULkVycm9yKCkpKSwgLy8gZXJyXHJcbiAgICBULm9wdGlvbihzY2hlbWEpLCAvLyByZXNcclxuICBdKSkpO1xyXG59XHJcblxyXG5jb25zdCB1c2VyU2NoZW1hID0gVC5zaGFwZSh7XHJcbiAgdXNlcklkOiBULlN0cmluZygpLFxyXG4gIHVzZXJOYW1lOiBULlN0cmluZygpLFxyXG4gIHByb2ZpbGVQaWN0dXJlOiBULlN0cmluZygpLFxyXG59KTtcclxuXHJcbkBpbmplY3QoJ2F1dGhUb2tlbicsIChwcm9wcywgeyBsb2NhbCB9KSA9PiBsb2NhbC5nZXQoJy9hdXRoVG9rZW4nKSlcclxuQG11bHRpSW5qZWN0KCh7IHVzZXJJZCwgYXV0aFRva2VuIH0sIHsgaHR0cCwgbG9jYWwgfSkgPT4gKHtcclxuICBhdXRoVG9rZW46IGxvY2FsLmdldCgnL2F1dGhUb2tlbicpLFxyXG4gIGVycm9yOiBodHRwLmdldCgnL2Vycm9yJyksXHJcbiAgZm9udFNpemU6IGxvY2FsLmdldCgnL2ZvbnRTaXplJyksXHJcbiAgbWU6IGh0dHAuZ2V0KGAvbWVgLCB7IHF1ZXJ5OiB7IGF1dGhUb2tlbjogbGFzdFZhbHVlT2YoYXV0aFRva2VuKSB9IH0pLFxyXG4gIHVzZXI6IGh0dHAuZ2V0KGAvdXNlcnMvJHt1c2VySWR9YCksXHJcbiAgdXNlcnM6IGh0dHAuZ2V0KGAvdXNlcnNgLCB7IHJlZnJlc2hFdmVyeTogNTAwMCB9KSxcclxufSkpXHJcbkBwdXJlXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVzZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdVc2VyJztcclxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgYXV0aFRva2VuOiBwcm9wVHlwZShULlN0cmluZygpKSxcclxuICAgIGZvbnRTaXplOiBwcm9wVHlwZShULm9uZU9mKFQuU3RyaW5nKCksIFQuTnVtYmVyKCkpKSxcclxuICAgIG1lOiBwcm9wVHlwZSh1c2VyU2NoZW1hKSxcclxuICAgIHVzZXI6IHByb3BUeXBlKHVzZXJTY2hlbWEpLFxyXG4gICAgdXNlcklkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcbiAgICB1c2VyczogcHJvcFR5cGUoVC5BcnJheSh7IHR5cGU6IHVzZXJTY2hlbWEgfSkpLFxyXG4gIH07XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XHJcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XHJcbiAgICB0aGlzLnN0YXRlID0ge307XHJcbiAgfVxyXG5cclxuICBmb2xsb3dVc2VyKCkge1xyXG4gICAgY29uc3QgeyB1c2VySWQsIGF1dGhUb2tlbiB9ID0gdGhpcy5wcm9wcztcclxuICAgIGNvbnN0IHsgaHR0cCB9ID0gdGhpcy5jb250ZXh0WyRuZXh1c107XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgZm9sbG93aW5nOiBodHRwLmRpc3BhdGNoKCdmb2xsb3cgdXNlcicsIHtcclxuICAgICAgICB1c2VySWQ6IGxhc3RWYWx1ZU9mKHVzZXJJZCksXHJcbiAgICAgICAgYXV0aFRva2VuOiBsYXN0VmFsdWVPZihhdXRoVG9rZW4pLFxyXG4gICAgICB9KSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRm9udFNpemUoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc3QgeyBsb2NhbCB9ID0gdGhpcy5jb250ZXh0WyRuZXh1c107XHJcbiAgICBsb2NhbC5kaXNwYXRjaCgnc2V0IGZvbnQgc2l6ZScsIHsgZm9udFNpemU6IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3QgeyBmb250U2l6ZSwgdXNlcnMsIHVzZXIgfSA9IHRoaXMucHJvcHM7XHJcbiAgICBjb25zdCB7IGZvbGxvd2luZyB9ID0gdGhpcy5zdGF0ZTtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiBsYXN0VmFsdWVPZihmb250U2l6ZSkgfX0+XHJcbiAgICAgIDxVc2VycyB1c2Vycz17dXNlcnN9IC8+XHJcbiAgICAgIDxVc2VyUHJvZmlsZSB1c2VyPXt1c2VyfSBmb2xsb3dpbmc9e2ZvbGxvd2luZ30gZm9sbG93VXNlcj17KCkgPT4gdGhpcy5mb2xsb3dVc2VyKCl9IC8+XHJcbiAgICAgIDxkaXY+bW9kaWZ5IGZvbnQgc2l6ZTpcclxuICAgICAgICA8aW5wdXQgdHlwZT0ndGV4dCcgb25DaGFuZ2U9eyhlKSA9PiB0aGlzLnVwZGF0ZUZvbnRTaXplKGUpfSB2YWx1ZT17bGFzdFZhbHVlT2YoZm9udFNpemUpfSAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PjtcclxuICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
