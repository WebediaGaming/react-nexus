"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;
  var React = R.React;

  var _2 = (function () {
    var _2 = function _2(component) {
      this._subject = component;
    };

    _classProps(_2, null, {
      get: {
        writable: true,
        value: function () {
          return this._subject;
        }
      },
      type: {
        writable: true,
        value: function (optType) {
          if (optType) {
            this._subject = optType(this._subject.props);
            return this;
          } else {
            return this._subject.type;
          }
        }
      },
      prop: {
        writable: true,
        value: function (key, optVal) {
          if (optVal) {
            this._subject = this._subject.type(this._subject.props);
            this._subject.props[key] = optVal;
            return this;
          } else {
            return this._subject.props[key];
          }
        }
      },
      props: {
        writable: true,
        value: function (arg) {
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
        }
      },
      classNameList: {
        writable: true,
        value: function (optVal) {
          if (optVal) {
            return this.prop("className", optVal.join(" "));
          } else {
            return (this.prop("className") || "").split(" ");
          }
        }
      },
      addClassName: {
        writable: true,
        value: function (className) {
          var cx = this.classNameList();
          cx.push(className);
          return this.prop("className", _.uniq(cx));
        }
      },
      removeClassName: {
        writable: true,
        value: function (className) {
          var cx = this.classNameList();
          cx = _.without(cx, className);
          return this.prop("className", cx);
        }
      },
      hasClassName: {
        writable: true,
        value: function (className) {
          var cx = this.classNameList();
          return _.contains(cx, className);
        }
      },
      toggleClassName: {
        writable: true,
        value: function (className, optVal) {
          if (!_.isUndefined(optVal)) {
            if (optVal) {
              return this.addClassName(className);
            } else {
              return this.removeClassName(className);
            }
          } else {
            return this.toggleClassName(className, !this.hasClassName(className));
          }
        }
      },
      append: {
        writable: true,
        value: function (component) {
          var children = React.Children.getChildrenList(this._subject);
          children.push(component);
          return this.prop("children", children);
        }
      },
      prepend: {
        writable: true,
        value: function (component) {
          var children = React.Children.getChildrenList(this._subject);
          children.unshift(component);
          return this.prop("children", children);
        }
      },
      transformTree: {
        writable: true,
        value: function (fn) {
          this._subject = React.Children.transformTree(this._subject, fn);
          return this;
        }
      },
      tap: {
        writable: true,
        value: function (fn) {
          fn(this._subject);
          return this;
        }
      },
      walkTree: {
        writable: true,
        value: function (fn) {
          var tree = React.Children.mapTree(this._subject, _.identity);
          tree.forEach(fn);
          return this;
        }
      },
      endend: {
        writable: true,
        value: function () {
          var _subject = this._subject;
          this._subject = null;
          return _subject;
        }
      }
    });

    return _2;
  })();

  _.extend(_2.prototype, /** @lends $.prototype */{
    _subject: null });

  return _2;
};
//# sourceMappingURL=data:application/json;base64,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QyxDQUFDLFNBQVMsMkJBQTJCO0FBQzdDLFlBQVEsRUFBRSxJQUFJLEVBQ2YsQ0FBQyxDQUFDOztBQUVILFNBQU8sRUFBQyxDQUFDO0NBQ1YsQ0FBQyIsImZpbGUiOiJSLiQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcclxuXHJcbiAgY2xhc3MgJCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb21wb25lbnQpIHtcclxuICAgICAgdGhpcy5fc3ViamVjdCA9IGNvbXBvbmVudDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9zdWJqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHR5cGUob3B0VHlwZSkge1xyXG4gICAgICBpZihvcHRUeXBlKSB7XHJcbiAgICAgICAgdGhpcy5fc3ViamVjdCA9IG9wdFR5cGUodGhpcy5fc3ViamVjdC5wcm9wcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1YmplY3QudHlwZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3Aoa2V5LCBvcHRWYWwpIHtcclxuICAgICAgaWYob3B0VmFsKSB7XHJcbiAgICAgICAgdGhpcy5fc3ViamVjdCA9IHRoaXMuX3N1YmplY3QudHlwZSh0aGlzLl9zdWJqZWN0LnByb3BzKTtcclxuICAgICAgICB0aGlzLl9zdWJqZWN0LnByb3BzW2tleV0gPSBvcHRWYWw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1YmplY3QucHJvcHNba2V5XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3BzKGFyZykge1xyXG4gICAgICBpZihfLmlzQXJyYXkoYXJnKSkge1xyXG4gICAgICAgIHJldHVybiBfLm9iamVjdChhcmcubWFwKCh2YWwsIGtleSkgPT4gW2tleSwgdGhpcy5fc3ViamVjdC5wcm9wc1trZXldXSkpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMuX3N1YmplY3QgPSB0aGlzLl9zdWJqZWN0LnR5cGUodGhpcy5fc3ViamVjdC5wcm9wcyk7XHJcbiAgICAgICAgYXJnLmZvckVhY2goKHZhbCwga2V5KSA9PiB0aGlzLl9zdWJqZWN0LnByb3BzW2tleV0gPSB2YWwpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3NOYW1lTGlzdChvcHRWYWwpIHtcclxuICAgICAgaWYob3B0VmFsKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcCgnY2xhc3NOYW1lJywgb3B0VmFsLmpvaW4oJyAnKSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnByb3AoJ2NsYXNzTmFtZScpIHx8ICcnKS5zcGxpdCgnICcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ2xhc3NOYW1lKGNsYXNzTmFtZSkge1xyXG4gICAgICBsZXQgY3ggPSB0aGlzLmNsYXNzTmFtZUxpc3QoKTtcclxuICAgICAgY3gucHVzaChjbGFzc05hbWUpO1xyXG4gICAgICByZXR1cm4gdGhpcy5wcm9wKCdjbGFzc05hbWUnLCBfLnVuaXEoY3gpKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVDbGFzc05hbWUoY2xhc3NOYW1lKSB7XHJcbiAgICAgIGxldCBjeCA9IHRoaXMuY2xhc3NOYW1lTGlzdCgpO1xyXG4gICAgICBjeCA9IF8ud2l0aG91dChjeCwgY2xhc3NOYW1lKTtcclxuICAgICAgcmV0dXJuIHRoaXMucHJvcCgnY2xhc3NOYW1lJywgY3gpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhc0NsYXNzTmFtZShjbGFzc05hbWUpIHtcclxuICAgICAgbGV0IGN4ID0gdGhpcy5jbGFzc05hbWVMaXN0KCk7XHJcbiAgICAgIHJldHVybiBfLmNvbnRhaW5zKGN4LCBjbGFzc05hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZUNsYXNzTmFtZShjbGFzc05hbWUsIG9wdFZhbCkge1xyXG4gICAgICBpZighXy5pc1VuZGVmaW5lZChvcHRWYWwpKSB7XHJcbiAgICAgICAgaWYob3B0VmFsKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5hZGRDbGFzc05hbWUoY2xhc3NOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVDbGFzc05hbWUoY2xhc3NOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG9nZ2xlQ2xhc3NOYW1lKGNsYXNzTmFtZSwgIXRoaXMuaGFzQ2xhc3NOYW1lKGNsYXNzTmFtZSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kKGNvbXBvbmVudCkge1xyXG4gICAgICBsZXQgY2hpbGRyZW4gPSBSZWFjdC5DaGlsZHJlbi5nZXRDaGlsZHJlbkxpc3QodGhpcy5fc3ViamVjdCk7XHJcbiAgICAgIGNoaWxkcmVuLnB1c2goY29tcG9uZW50KTtcclxuICAgICAgcmV0dXJuIHRoaXMucHJvcCgnY2hpbGRyZW4nLCBjaGlsZHJlbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJlcGVuZChjb21wb25lbnQpIHtcclxuICAgICAgbGV0IGNoaWxkcmVuID0gUmVhY3QuQ2hpbGRyZW4uZ2V0Q2hpbGRyZW5MaXN0KHRoaXMuX3N1YmplY3QpO1xyXG4gICAgICBjaGlsZHJlbi51bnNoaWZ0KGNvbXBvbmVudCk7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3AoJ2NoaWxkcmVuJywgY2hpbGRyZW4pO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVRyZWUoZm4pIHtcclxuICAgICAgdGhpcy5fc3ViamVjdCA9IFJlYWN0LkNoaWxkcmVuLnRyYW5zZm9ybVRyZWUodGhpcy5fc3ViamVjdCwgZm4pO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICB0YXAoZm4pIHtcclxuICAgICAgZm4odGhpcy5fc3ViamVjdCk7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHdhbGtUcmVlKGZuKSB7XHJcbiAgICAgIGxldCB0cmVlID0gUmVhY3QuQ2hpbGRyZW4ubWFwVHJlZSh0aGlzLl9zdWJqZWN0LCBfLmlkZW50aXR5KTtcclxuICAgICAgdHJlZS5mb3JFYWNoKGZuKTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZW5kZW5kKCkge1xyXG4gICAgICBsZXQgX3N1YmplY3QgPSB0aGlzLl9zdWJqZWN0O1xyXG4gICAgICB0aGlzLl9zdWJqZWN0ID0gbnVsbDtcclxuICAgICAgcmV0dXJuIF9zdWJqZWN0O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoJC5wcm90b3R5cGUsIC8qKiBAbGVuZHMgJC5wcm90b3R5cGUgKi97XHJcbiAgICBfc3ViamVjdDogbnVsbCxcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuICQ7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==