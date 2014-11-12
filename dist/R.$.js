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
  var React = R.React;

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

  _.extend($.prototype, /** @lends $.prototype */{
    _subject: null });

  return $;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLiQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7TUFFaEIsQ0FBQztRQUFELENBQUMsR0FDTSxTQURQLENBQUMsQ0FDTyxTQUFTLEVBQUU7QUFDckIsVUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7S0FDM0I7O2dCQUhHLENBQUM7QUFLTCxTQUFHOztlQUFBLFlBQUc7QUFDSixpQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3RCOztBQUVELFVBQUk7O2VBQUEsVUFBQyxPQUFPLEVBQUU7QUFDWixjQUFHLE9BQU8sRUFBRTtBQUNWLGdCQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdDLG1CQUFPLElBQUksQ0FBQztXQUNiLE1BQ0k7QUFDSCxtQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztXQUMzQjtTQUNGOztBQUVELFVBQUk7O2VBQUEsVUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBQ2hCLGNBQUcsTUFBTSxFQUFFO0FBQ1QsZ0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4RCxnQkFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFL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O1dBakhHLENBQUM7Ozs7O0FBb0hQLEdBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsMkJBQTJCO0FBQzdDLFlBQVEsRUFBRSxJQUFJLEVBQ2YsQ0FBQyxDQUFDOztBQUVILFNBQU8sQ0FBQyxDQUFDO0NBQ1YsQ0FBQyIsImZpbGUiOiJSLiQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcbiAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xuXG4gIGNsYXNzICQge1xuICAgIGNvbnN0cnVjdG9yKGNvbXBvbmVudCkge1xuICAgICAgdGhpcy5fc3ViamVjdCA9IGNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3ViamVjdDtcbiAgICB9XG5cbiAgICB0eXBlKG9wdFR5cGUpIHtcbiAgICAgIGlmKG9wdFR5cGUpIHtcbiAgICAgICAgdGhpcy5fc3ViamVjdCA9IG9wdFR5cGUodGhpcy5fc3ViamVjdC5wcm9wcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdWJqZWN0LnR5cGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJvcChrZXksIG9wdFZhbCkge1xuICAgICAgaWYob3B0VmFsKSB7XG4gICAgICAgIHRoaXMuX3N1YmplY3QgPSB0aGlzLl9zdWJqZWN0LnR5cGUodGhpcy5fc3ViamVjdC5wcm9wcyk7XG4gICAgICAgIHRoaXMuX3N1YmplY3QucHJvcHNba2V5XSA9IG9wdFZhbDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1YmplY3QucHJvcHNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9wcyhhcmcpIHtcbiAgICAgIGlmKF8uaXNBcnJheShhcmcpKSB7XG4gICAgICAgIHJldHVybiBfLm9iamVjdChhcmcubWFwKCh2YWwsIGtleSkgPT4gW2tleSwgdGhpcy5fc3ViamVjdC5wcm9wc1trZXldXSkpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX3N1YmplY3QgPSB0aGlzLl9zdWJqZWN0LnR5cGUodGhpcy5fc3ViamVjdC5wcm9wcyk7XG4gICAgICAgIGFyZy5mb3JFYWNoKCh2YWwsIGtleSkgPT4gdGhpcy5fc3ViamVjdC5wcm9wc1trZXldID0gdmFsKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3NOYW1lTGlzdChvcHRWYWwpIHtcbiAgICAgIGlmKG9wdFZhbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wKCdjbGFzc05hbWUnLCBvcHRWYWwuam9pbignICcpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gKHRoaXMucHJvcCgnY2xhc3NOYW1lJykgfHwgJycpLnNwbGl0KCcgJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkQ2xhc3NOYW1lKGNsYXNzTmFtZSkge1xuICAgICAgbGV0IGN4ID0gdGhpcy5jbGFzc05hbWVMaXN0KCk7XG4gICAgICBjeC5wdXNoKGNsYXNzTmFtZSk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wKCdjbGFzc05hbWUnLCBfLnVuaXEoY3gpKTtcbiAgICB9XG5cbiAgICByZW1vdmVDbGFzc05hbWUoY2xhc3NOYW1lKSB7XG4gICAgICBsZXQgY3ggPSB0aGlzLmNsYXNzTmFtZUxpc3QoKTtcbiAgICAgIGN4ID0gXy53aXRob3V0KGN4LCBjbGFzc05hbWUpO1xuICAgICAgcmV0dXJuIHRoaXMucHJvcCgnY2xhc3NOYW1lJywgY3gpO1xuICAgIH1cblxuICAgIGhhc0NsYXNzTmFtZShjbGFzc05hbWUpIHtcbiAgICAgIGxldCBjeCA9IHRoaXMuY2xhc3NOYW1lTGlzdCgpO1xuICAgICAgcmV0dXJuIF8uY29udGFpbnMoY3gsIGNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlQ2xhc3NOYW1lKGNsYXNzTmFtZSwgb3B0VmFsKSB7XG4gICAgICBpZighXy5pc1VuZGVmaW5lZChvcHRWYWwpKSB7XG4gICAgICAgIGlmKG9wdFZhbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmFkZENsYXNzTmFtZShjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUNsYXNzTmFtZShjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9nZ2xlQ2xhc3NOYW1lKGNsYXNzTmFtZSwgIXRoaXMuaGFzQ2xhc3NOYW1lKGNsYXNzTmFtZSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFwcGVuZChjb21wb25lbnQpIHtcbiAgICAgIGxldCBjaGlsZHJlbiA9IFJlYWN0Q2hpbGRyZW4uZ2V0Q2hpbGRyZW5MaXN0KHRoaXMuX3N1YmplY3QpO1xuICAgICAgY2hpbGRyZW4ucHVzaChjb21wb25lbnQpO1xuICAgICAgcmV0dXJuIHRoaXMucHJvcCgnY2hpbGRyZW4nLCBjaGlsZHJlbik7XG4gICAgfVxuXG4gICAgcHJlcGVuZChjb21wb25lbnQpIHtcbiAgICAgIGxldCBjaGlsZHJlbiA9IFJlYWN0Q2hpbGRyZW4uZ2V0Q2hpbGRyZW5MaXN0KHRoaXMuX3N1YmplY3QpO1xuICAgICAgY2hpbGRyZW4udW5zaGlmdChjb21wb25lbnQpO1xuICAgICAgcmV0dXJuIHRoaXMucHJvcCgnY2hpbGRyZW4nLCBjaGlsZHJlbik7XG4gICAgfVxuXG4gICAgdHJhbnNmb3JtVHJlZShmbikge1xuICAgICAgdGhpcy5fc3ViamVjdCA9IFJlYWN0Q2hpbGRyZW4udHJhbnNmb3JtVHJlZSh0aGlzLl9zdWJqZWN0LCBmbik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0YXAoZm4pIHtcbiAgICAgIGZuKHRoaXMuX3N1YmplY3QpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgd2Fsa1RyZWUoZm4pIHtcbiAgICAgIGxldCB0cmVlID0gUmVhY3RDaGlsZHJlbi5tYXBUcmVlKHRoaXMuX3N1YmplY3QsIF8uaWRlbnRpdHkpO1xuICAgICAgdHJlZS5mb3JFYWNoKGZuKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGVuZGVuZCgpIHtcbiAgICAgIGxldCBfc3ViamVjdCA9IHRoaXMuX3N1YmplY3Q7XG4gICAgICB0aGlzLl9zdWJqZWN0ID0gbnVsbDtcbiAgICAgIHJldHVybiBfc3ViamVjdDtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZCgkLnByb3RvdHlwZSwgLyoqIEBsZW5kcyAkLnByb3RvdHlwZSAqL3tcbiAgICBfc3ViamVjdDogbnVsbCxcbiAgfSk7XG5cbiAgcmV0dXJuICQ7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9