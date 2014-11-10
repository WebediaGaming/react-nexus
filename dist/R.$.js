"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);

  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;
  var should = R.should;

  var $ = (function () {
    var $ = function $(component) {
      this._subject = component;
    };

    _classProps($, null, {
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
          var children = ReactChildren.getChildrenList(this._subject);
          children.push(component);
          return this.prop("children", children);
        }
      },
      prepend: {
        writable: true,
        value: function (component) {
          var children = ReactChildren.getChildrenList(this._subject);
          children.unshift(component);
          return this.prop("children", children);
        }
      },
      transformTree: {
        writable: true,
        value: function (fn) {
          this._subject = ReactChildren.transformTree(this._subject, fn);
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
          var tree = ReactChildren.mapTree(this._subject, _.identity);
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

    return $;
  })();

  _.extend($.prototype, {
    _subject: null });

  return $;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLiQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLENBQUM7UUFBRCxDQUFDLEdBQ00sU0FEUCxDQUFDLENBQ08sU0FBUyxFQUFFO0FBQ3JCLFVBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO0tBQzNCOztnQkFIRyxDQUFDO0FBS0wsU0FBRzs7ZUFBQSxZQUFHO0FBQ0osaUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN0Qjs7QUFFRCxVQUFJOztlQUFBLFVBQUMsT0FBTyxFQUFFO0FBQ1osY0FBRyxPQUFPLEVBQUU7QUFDVixnQkFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QyxtQkFBTyxJQUFJLENBQUM7V0FDYixNQUNJO0FBQ0gsbUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7V0FDM0I7U0FDRjs7QUFFRCxVQUFJOztlQUFBLFVBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRTtBQUNoQixjQUFHLE1BQU0sRUFBRTtBQUNULGdCQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEQsZ0JBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUNsQyxtQkFB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LENBQUMsQ0FBQyxTQUFTLEVBQUU7QUFDcEIsWUFBUSxFQUFFLElBQUksRUFDZixDQUFDLENBQUM7O0FBRUgsU0FBTyxDQUFDLENBQUM7Q0FDVixDQUFDIiwiZmlsZSI6IlIuJC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuXG4gIGNsYXNzICQge1xuICAgIGNvbnN0cnVjdG9yKGNvbXBvbmVudCkge1xuICAgICAgdGhpcy5fc3ViamVjdCA9IGNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3ViamVjdDtcbiAgICB9XG5cbiAgICB0eXBlKG9wdFR5cGUpIHtcbiAgICAgIGlmKG9wdFR5cGUpIHtcbiAgICAgICAgdGhpcy5fc3ViamVjdCA9IG9wdFR5cGUodGhpcy5fc3ViamVjdC5wcm9wcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdWJqZWN0LnR5cGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJvcChrZXksIG9wdFZhbCkge1xuICAgICAgaWYob3B0VmFsKSB7XG4gICAgICAgIHRoaXMuX3N1YmplY3QgPSB0aGlzLl9zdWJqZWN0LnR5cGUodGhpcy5fc3ViamVjdC5wcm9wcyk7XG4gICAgICAgIHRoaXMuX3N1YmplY3QucHJvcHNba2V5XSA9IG9wdFZhbDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1YmplY3QucHJvcHNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9wcyhhcmcpIHtcbiAgICAgIGlmKF8uaXNBcnJheShhcmcpKSB7XG4gICAgICAgIHJldHVybiBfLm9iamVjdChhcmcubWFwKCh2YWwsIGtleSkgPT4gW2tleSwgdGhpcy5fc3ViamVjdC5wcm9wc1trZXldXSkpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX3N1YmplY3QgPSB0aGlzLl9zdWJqZWN0LnR5cGUodGhpcy5fc3ViamVjdC5wcm9wcyk7XG4gICAgICAgIGFyZy5mb3JFYWNoKCh2YWwsIGtleSkgPT4gdGhpcy5fc3ViamVjdC5wcm9wc1trZXldID0gdmFsKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3NOYW1lTGlzdChvcHRWYWwpIHtcbiAgICAgIGlmKG9wdFZhbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wKCdjbGFzc05hbWUnLCBvcHRWYWwuam9pbignICcpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gKHRoaXMucHJvcCgnY2xhc3NOYW1lJykgfHwgJycpLnNwbGl0KCcgJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkQ2xhc3NOYW1lKGNsYXNzTmFtZSkge1xuICAgICAgbGV0IGN4ID0gdGhpcy5jbGFzc05hbWVMaXN0KCk7XG4gICAgICBjeC5wdXNoKGNsYXNzTmFtZSk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wKCdjbGFzc05hbWUnLCBfLnVuaXEoY3gpKTtcbiAgICB9XG5cbiAgICByZW1vdmVDbGFzc05hbWUoY2xhc3NOYW1lKSB7XG4gICAgICBsZXQgY3ggPSB0aGlzLmNsYXNzTmFtZUxpc3QoKTtcbiAgICAgIGN4ID0gXy53aXRob3V0KGN4LCBjbGFzc05hbWUpO1xuICAgICAgcmV0dXJuIHRoaXMucHJvcCgnY2xhc3NOYW1lJywgY3gpO1xuICAgIH1cblxuICAgIGhhc0NsYXNzTmFtZShjbGFzc05hbWUpIHtcbiAgICAgIGxldCBjeCA9IHRoaXMuY2xhc3NOYW1lTGlzdCgpO1xuICAgICAgcmV0dXJuIF8uY29udGFpbnMoY3gsIGNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlQ2xhc3NOYW1lKGNsYXNzTmFtZSwgb3B0VmFsKSB7XG4gICAgICBpZighXy5pc1VuZGVmaW5lZChvcHRWYWwpKSB7XG4gICAgICAgIGlmKG9wdFZhbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmFkZENsYXNzTmFtZShjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUNsYXNzTmFtZShjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9nZ2xlQ2xhc3NOYW1lKGNsYXNzTmFtZSwgIXRoaXMuaGFzQ2xhc3NOYW1lKGNsYXNzTmFtZSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFwcGVuZChjb21wb25lbnQpIHtcbiAgICAgIGxldCBjaGlsZHJlbiA9IFJlYWN0Q2hpbGRyZW4uZ2V0Q2hpbGRyZW5MaXN0KHRoaXMuX3N1YmplY3QpO1xuICAgICAgY2hpbGRyZW4ucHVzaChjb21wb25lbnQpO1xuICAgICAgcmV0dXJuIHRoaXMucHJvcCgnY2hpbGRyZW4nLCBjaGlsZHJlbik7XG4gICAgfVxuXG4gICAgcHJlcGVuZChjb21wb25lbnQpIHtcbiAgICAgIGxldCBjaGlsZHJlbiA9IFJlYWN0Q2hpbGRyZW4uZ2V0Q2hpbGRyZW5MaXN0KHRoaXMuX3N1YmplY3QpO1xuICAgICAgY2hpbGRyZW4udW5zaGlmdChjb21wb25lbnQpO1xuICAgICAgcmV0dXJuIHRoaXMucHJvcCgnY2hpbGRyZW4nLCBjaGlsZHJlbik7XG4gICAgfVxuXG4gICAgdHJhbnNmb3JtVHJlZShmbikge1xuICAgICAgdGhpcy5fc3ViamVjdCA9IFJlYWN0Q2hpbGRyZW4udHJhbnNmb3JtVHJlZSh0aGlzLl9zdWJqZWN0LCBmbik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0YXAoZm4pIHtcbiAgICAgIGZuKHRoaXMuX3N1YmplY3QpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgd2Fsa1RyZWUoZm4pIHtcbiAgICAgIGxldCB0cmVlID0gUmVhY3RDaGlsZHJlbi5tYXBUcmVlKHRoaXMuX3N1YmplY3QsIF8uaWRlbnRpdHkpO1xuICAgICAgdHJlZS5mb3JFYWNoKGZuKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGVuZGVuZCgpIHtcbiAgICAgIGxldCBfc3ViamVjdCA9IHRoaXMuX3N1YmplY3Q7XG4gICAgICB0aGlzLl9zdWJqZWN0ID0gbnVsbDtcbiAgICAgIHJldHVybiBfc3ViamVjdDtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZCgkLnByb3RvdHlwZSwge1xuICAgIF9zdWJqZWN0OiBudWxsLFxuICB9KTtcblxuICByZXR1cm4gJDtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=