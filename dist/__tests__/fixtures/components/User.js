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

    var _getNexusOf = _.getNexusOf(this);

    var http = _getNexusOf.http;

    this.setState({
      following: http.dispatch('follow user', {
        userId: _.lastValueOf(userId),
        authToken: _.lastValueOf(authToken)
      })
    });
  };

  User.prototype.updateFontSize = function updateFontSize(e) {
    e.preventDefault();

    var _getNexusOf2 = _.getNexusOf(this);

    var local = _getNexusOf2.local;

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
    return {
      error: http.get('/error'),
      me: http.get('/me', { query: { authToken: _.lastValueOf(authToken) } }),
      user: http.get('/users/' + userId),
      users: http.get('/users', { refreshEvery: 5000 })
    };
  })(User) || User;
  User = _.inject('fontSize', function (props, _ref6) {
    var local = _ref6.local;
    return local.get('/fontSize');
  })(User) || User;
  User = _.inject('authToken', function (props, _ref7) {
    var local = _ref7.local;
    return local.get('/authToken');
  })(User) || User;
  return User;
})(_react2['default'].Component);

exports['default'] = User;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fdGVzdHNfXy9maXh0dXJlcy9jb21wb25lbnRzL1VzZXIuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztxQkFBa0IsT0FBTzs7OztrQ0FDWCxxQkFBcUI7Ozs7Z0JBRXdELFdBQVc7Ozs7QUFJdEcsU0FBUyxLQUFLLENBQUMsSUFBUyxFQUFFO01BQVQsS0FBSyxHQUFQLElBQVMsQ0FBUCxLQUFLOztBQUNwQixNQUFHLFlBQVUsS0FBSyxDQUFDLEVBQUU7QUFDbkIsV0FBTzs7OztLQUF1QixDQUFDO0dBQ2hDOztNQUNNLEdBQUcsR0FBVSxjQUFZLEtBQUssQ0FBQzs7TUFBMUIsR0FBRyxHQUF5QixjQUFZLEtBQUssQ0FBQzs7QUFDMUQsTUFBRyxHQUFHLEVBQUU7QUFDTixXQUFPOzs7TUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFO0tBQUssQ0FBQztHQUNoQztBQUNELFNBQU87Ozs7SUFBaUIsR0FBRyxDQUFDLE1BQU07R0FBSyxDQUFDO0NBQ3pDOztBQUVELFNBQVMsV0FBVyxDQUFDLEtBQStCLEVBQUU7TUFBL0IsSUFBSSxHQUFOLEtBQStCLENBQTdCLElBQUk7TUFBRSxTQUFTLEdBQWpCLEtBQStCLENBQXZCLFNBQVM7TUFBRSxVQUFVLEdBQTdCLEtBQStCLENBQVosVUFBVTs7QUFDaEQsTUFBRyxZQUFVLElBQUksQ0FBQyxFQUFFO0FBQ2xCLFdBQU87Ozs7S0FBc0IsQ0FBQztHQUMvQjs7TUFDTSxHQUFHLEdBQVUsY0FBWSxJQUFJLENBQUM7O01BQXpCLEdBQUcsR0FBd0IsY0FBWSxJQUFJLENBQUM7O0FBQ3hELE1BQUcsR0FBRyxFQUFFO0FBQ04sV0FBTzs7O01BQUksR0FBRyxDQUFDLFFBQVEsRUFBRTtLQUFLLENBQUM7R0FDaEM7TUFDTyxRQUFRLEdBQXFCLEdBQUcsQ0FBaEMsUUFBUTtNQUFFLGNBQWMsR0FBSyxHQUFHLENBQXRCLGNBQWM7O0FBQ2hDLFNBQU87Ozs7SUFDSyxRQUFROztJQUFFLDBDQUFLLEdBQUcsRUFB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TixJQUFJO1dBQVE7QUFDakQsV0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQ3pCLFFBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLGNBQVksU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ3JFLFVBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxhQUFXLE1BQU0sQ0FBRztBQUNsQyxXQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsV0FBVyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQztLQUNsRDtHQUFDLENBQUMsQ0FFa0IsSUFBSSxLQUFKLElBQUk7QUFBSixNQUFJLEdBUnhCLFNBQU8sVUFBVSxFQUFFLFVBQUMsS0FBSyxFQUFFLEtBQVM7UUFBUCxLQUFLLEdBQVAsS0FBUyxDQUFQLEtBQUs7V0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztHQUFBLENBQUMsQ0FRNUMsSUFBSSxLQUFKLElBQUk7QUFBSixNQUFJLEdBVHhCLFNBQU8sV0FBVyxFQUFFLFVBQUMsS0FBSyxFQUFFLEtBQVM7UUFBUCxLQUFLLEdBQVAsS0FBUyxDQUFQLEtBQUs7V0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztHQUFBLENBQUMsQ0FTOUMsSUFBSSxLQUFKLElBQUk7U0FBSixJQUFJO0dBQVMsbUJBQU0sU0FBUzs7cUJBQTVCLElBQUkiLCJmaWxlIjoiX190ZXN0c19fL2ZpeHR1cmVzL2NvbXBvbmVudHMvVXNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBUIGZyb20gJ3R5cGVjaGVjay1kZWNvcmF0b3InO1xyXG5cclxuaW1wb3J0IHsgaW5qZWN0LCBtdWx0aUluamVjdCwgcHVyZSwgaXNQZW5kaW5nLCBsYXN0RXJyb3JPZiwgbGFzdFZhbHVlT2YsIGdldE5leHVzT2YgfSBmcm9tICcuLi8uLi8uLi8nO1xyXG5cclxuLy8gSGVscGVyIGNvbXBvbmVudHNcclxuXHJcbmZ1bmN0aW9uIFVzZXJzKHsgdXNlcnMgfSkge1xyXG4gIGlmKGlzUGVuZGluZyh1c2VycykpIHtcclxuICAgIHJldHVybiA8cD5Mb2FkaW5nIHVzZXJzLi4uPC9wPjtcclxuICB9XHJcbiAgY29uc3QgW2VyciwgdmFsXSA9IFtsYXN0RXJyb3JPZih1c2VycyksIGxhc3RWYWx1ZU9mKHVzZXJzKV07XHJcbiAgaWYoZXJyKSB7XHJcbiAgICByZXR1cm4gPHA+e2Vyci50b1N0cmluZygpfTwvcD47XHJcbiAgfVxyXG4gIHJldHVybiA8cD5Ub3RhbCB1c2Vyczoge3ZhbC5sZW5ndGh9PC9wPjtcclxufVxyXG5cclxuZnVuY3Rpb24gVXNlclByb2ZpbGUoeyB1c2VyLCBmb2xsb3dpbmcsIGZvbGxvd1VzZXIgfSkge1xyXG4gIGlmKGlzUGVuZGluZyh1c2VyKSkge1xyXG4gICAgcmV0dXJuIDxwPkxvYWRpbmcgdXNlci4uLjwvcD47XHJcbiAgfVxyXG4gIGNvbnN0IFtlcnIsIHZhbF0gPSBbbGFzdEVycm9yT2YodXNlciksIGxhc3RWYWx1ZU9mKHVzZXIpXTtcclxuICBpZihlcnIpIHtcclxuICAgIHJldHVybiA8cD57ZXJyLnRvU3RyaW5nKCl9PC9wPjtcclxuICB9XHJcbiAgY29uc3QgeyB1c2VyTmFtZSwgcHJvZmlsZVBpY3R1cmUgfSA9IHZhbDtcclxuICByZXR1cm4gPHA+XHJcbiAgICBVc2VybmFtZSB7dXNlck5hbWV9IDxpbWcgc3JjPXtwcm9maWxlUGljdHVyZX0gLz5cclxuICAgIDxGb2xsb3dCdXR0b24gZm9sbG93aW5nPXtmb2xsb3dpbmd9IG9uQ2xpY2s9e2ZvbGxvd1VzZXJ9IC8+XHJcbiAgPC9wPjtcclxufVxyXG5cclxuZnVuY3Rpb24gRm9sbG93QnV0dG9uKHsgZm9sbG93aW5nLCBvbkNsaWNrIH0pIHtcclxuICBpZighZm9sbG93aW5nIHx8IGZvbGxvd2luZy5pc1BlbmRpbmcoKSkge1xyXG4gICAgcmV0dXJuIDxidXR0b24gb25DbGljaz17b25DbGlja30gZGlzYWJsZWQ9e2ZvbGxvd2luZyAmJiBmb2xsb3dpbmcuaXNQZW5kaW5nKCl9PlxyXG4gICAgICBGb2xsb3cgdXNlclxyXG4gICAgPC9idXR0b24+O1xyXG4gIH1cclxuICBpZihmb2xsb3dpbmcuaXNSZWplY3RlZCgpKSB7XHJcbiAgICByZXR1cm4gPHA+e2ZvbGxvd2luZy5yZWFzb24oKS50b1N0cmluZygpfTwvcD47XHJcbiAgfVxyXG4gIHJldHVybiA8cD57Zm9sbG93aW5nLnZhbHVlKCkudG9TdHJpbmcoKX08L3A+O1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9wVHlwZShzY2hlbWEpIHtcclxuICByZXR1cm4gVC50b1Byb3BUeXBlKFQuQXJyYXkoVC5zaGFwZShbXHJcbiAgICBULm9wdGlvbihULm9uZU9mKFQuZXhhY3RseShudWxsKSwgVC5FcnJvcigpKSksIC8vIGVyclxyXG4gICAgVC5vcHRpb24oc2NoZW1hKSwgLy8gcmVzXHJcbiAgXSkpKTtcclxufVxyXG5cclxuY29uc3QgdXNlclNjaGVtYSA9IFQuc2hhcGUoe1xyXG4gIHVzZXJJZDogVC5TdHJpbmcoKSxcclxuICB1c2VyTmFtZTogVC5TdHJpbmcoKSxcclxuICBwcm9maWxlUGljdHVyZTogVC5TdHJpbmcoKSxcclxufSk7XHJcblxyXG5AaW5qZWN0KCdhdXRoVG9rZW4nLCAocHJvcHMsIHsgbG9jYWwgfSkgPT4gbG9jYWwuZ2V0KCcvYXV0aFRva2VuJykpXHJcbkBpbmplY3QoJ2ZvbnRTaXplJywgKHByb3BzLCB7IGxvY2FsIH0pID0+IGxvY2FsLmdldCgnL2ZvbnRTaXplJykpXHJcbkBtdWx0aUluamVjdCgoeyB1c2VySWQsIGF1dGhUb2tlbiB9LCB7IGh0dHAgfSkgPT4gKHtcclxuICBlcnJvcjogaHR0cC5nZXQoJy9lcnJvcicpLFxyXG4gIG1lOiBodHRwLmdldChgL21lYCwgeyBxdWVyeTogeyBhdXRoVG9rZW46IGxhc3RWYWx1ZU9mKGF1dGhUb2tlbikgfSB9KSxcclxuICB1c2VyOiBodHRwLmdldChgL3VzZXJzLyR7dXNlcklkfWApLFxyXG4gIHVzZXJzOiBodHRwLmdldChgL3VzZXJzYCwgeyByZWZyZXNoRXZlcnk6IDUwMDAgfSksXHJcbn0pKVxyXG5AcHVyZVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnVXNlcic7XHJcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgIGF1dGhUb2tlbjogcHJvcFR5cGUoVC5TdHJpbmcoKSksXHJcbiAgICBmb250U2l6ZTogcHJvcFR5cGUoVC5vbmVPZihULlN0cmluZygpLCBULk51bWJlcigpKSksXHJcbiAgICBtZTogcHJvcFR5cGUodXNlclNjaGVtYSksXHJcbiAgICB1c2VyOiBwcm9wVHlwZSh1c2VyU2NoZW1hKSxcclxuICAgIHVzZXJJZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxyXG4gICAgdXNlcnM6IHByb3BUeXBlKFQuQXJyYXkoeyB0eXBlOiB1c2VyU2NoZW1hIH0pKSxcclxuICB9O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xyXG4gIH1cclxuXHJcbiAgZm9sbG93VXNlcigpIHtcclxuICAgIGNvbnN0IHsgdXNlcklkLCBhdXRoVG9rZW4gfSA9IHRoaXMucHJvcHM7XHJcbiAgICBjb25zdCB7IGh0dHAgfSA9IGdldE5leHVzT2YodGhpcyk7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgZm9sbG93aW5nOiBodHRwLmRpc3BhdGNoKCdmb2xsb3cgdXNlcicsIHtcclxuICAgICAgICB1c2VySWQ6IGxhc3RWYWx1ZU9mKHVzZXJJZCksXHJcbiAgICAgICAgYXV0aFRva2VuOiBsYXN0VmFsdWVPZihhdXRoVG9rZW4pLFxyXG4gICAgICB9KSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRm9udFNpemUoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc3QgeyBsb2NhbCB9ID0gZ2V0TmV4dXNPZih0aGlzKTtcclxuICAgIGxvY2FsLmRpc3BhdGNoKCdzZXQgZm9udCBzaXplJywgeyBmb250U2l6ZTogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBjb25zdCB7IGZvbnRTaXplLCB1c2VycywgdXNlciB9ID0gdGhpcy5wcm9wcztcclxuICAgIGNvbnN0IHsgZm9sbG93aW5nIH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6IGxhc3RWYWx1ZU9mKGZvbnRTaXplKSB9fT5cclxuICAgICAgPFVzZXJzIHVzZXJzPXt1c2Vyc30gLz5cclxuICAgICAgPFVzZXJQcm9maWxlIHVzZXI9e3VzZXJ9IGZvbGxvd2luZz17Zm9sbG93aW5nfSBmb2xsb3dVc2VyPXsoKSA9PiB0aGlzLmZvbGxvd1VzZXIoKX0gLz5cclxuICAgICAgPGRpdj5tb2RpZnkgZm9udCBzaXplOlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPSd0ZXh0JyBvbkNoYW5nZT17KGUpID0+IHRoaXMudXBkYXRlRm9udFNpemUoZSl9IHZhbHVlPXtsYXN0VmFsdWVPZihmb250U2l6ZSl9IC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+O1xyXG4gIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
