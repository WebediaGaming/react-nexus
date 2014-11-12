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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLiQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7TUFFaEIsQ0FBQztRQUFELENBQUMsR0FDTSxTQURQLENBQUMsQ0FDTyxTQUFTLEVBQUU7QUFDckIsVUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7S0FDM0I7O2dCQUhHLENBQUM7QUFLTCxTQUFHOztlQUFBLFlBQUc7QUFDSixpQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3RCOztBQUVELFVBQUk7O2VBQUEsVUFBQyxPQUFPLEVBQUU7QUFDWixjQUFHLE9BQU8sRUFBRTtBQUNWLGdCQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdDLG1CQUFPLElBQUksQ0FBQztXQUNiLE1BQ0k7QUFDSCxtQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztXQUMzQjtTQUNGOztBQUVELFVBQUk7O2VBQUEsVUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBQ2hCLGNBQUcsTUFBTSxFQUFFO0FBQ1QsZ0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4RCxnQkFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFL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O1dBakhHLENBQUM7Ozs7O0FBb0hQLEdBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsMkJBQTJCO0FBQzdDLFlBQVEsRUFBRSxJQUFJLEVBQ2YsQ0FBQyxDQUFDOztBQUVILFNBQU8sQ0FBQyxDQUFDO0NBQ1YsQ0FBQyIsImZpbGUiOiJSLiQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XHJcbiAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xyXG5cclxuICBjbGFzcyAkIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbXBvbmVudCkge1xyXG4gICAgICB0aGlzLl9zdWJqZWN0ID0gY29tcG9uZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3N1YmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgdHlwZShvcHRUeXBlKSB7XHJcbiAgICAgIGlmKG9wdFR5cGUpIHtcclxuICAgICAgICB0aGlzLl9zdWJqZWN0ID0gb3B0VHlwZSh0aGlzLl9zdWJqZWN0LnByb3BzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3ViamVjdC50eXBlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvcChrZXksIG9wdFZhbCkge1xyXG4gICAgICBpZihvcHRWYWwpIHtcclxuICAgICAgICB0aGlzLl9zdWJqZWN0ID0gdGhpcy5fc3ViamVjdC50eXBlKHRoaXMuX3N1YmplY3QucHJvcHMpO1xyXG4gICAgICAgIHRoaXMuX3N1YmplY3QucHJvcHNba2V5XSA9IG9wdFZhbDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3ViamVjdC5wcm9wc1trZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvcHMoYXJnKSB7XHJcbiAgICAgIGlmKF8uaXNBcnJheShhcmcpKSB7XHJcbiAgICAgICAgcmV0dXJuIF8ub2JqZWN0KGFyZy5tYXAoKHZhbCwga2V5KSA9PiBba2V5LCB0aGlzLl9zdWJqZWN0LnByb3BzW2tleV1dKSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fc3ViamVjdCA9IHRoaXMuX3N1YmplY3QudHlwZSh0aGlzLl9zdWJqZWN0LnByb3BzKTtcclxuICAgICAgICBhcmcuZm9yRWFjaCgodmFsLCBrZXkpID0+IHRoaXMuX3N1YmplY3QucHJvcHNba2V5XSA9IHZhbCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGFzc05hbWVMaXN0KG9wdFZhbCkge1xyXG4gICAgICBpZihvcHRWYWwpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wKCdjbGFzc05hbWUnLCBvcHRWYWwuam9pbignICcpKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcCgnY2xhc3NOYW1lJykgfHwgJycpLnNwbGl0KCcgJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhZGRDbGFzc05hbWUoY2xhc3NOYW1lKSB7XHJcbiAgICAgIGxldCBjeCA9IHRoaXMuY2xhc3NOYW1lTGlzdCgpO1xyXG4gICAgICBjeC5wdXNoKGNsYXNzTmFtZSk7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3AoJ2NsYXNzTmFtZScsIF8udW5pcShjeCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUNsYXNzTmFtZShjbGFzc05hbWUpIHtcclxuICAgICAgbGV0IGN4ID0gdGhpcy5jbGFzc05hbWVMaXN0KCk7XHJcbiAgICAgIGN4ID0gXy53aXRob3V0KGN4LCBjbGFzc05hbWUpO1xyXG4gICAgICByZXR1cm4gdGhpcy5wcm9wKCdjbGFzc05hbWUnLCBjeCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzQ2xhc3NOYW1lKGNsYXNzTmFtZSkge1xyXG4gICAgICBsZXQgY3ggPSB0aGlzLmNsYXNzTmFtZUxpc3QoKTtcclxuICAgICAgcmV0dXJuIF8uY29udGFpbnMoY3gsIGNsYXNzTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlQ2xhc3NOYW1lKGNsYXNzTmFtZSwgb3B0VmFsKSB7XHJcbiAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKG9wdFZhbCkpIHtcclxuICAgICAgICBpZihvcHRWYWwpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLmFkZENsYXNzTmFtZShjbGFzc05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUNsYXNzTmFtZShjbGFzc05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50b2dnbGVDbGFzc05hbWUoY2xhc3NOYW1lLCAhdGhpcy5oYXNDbGFzc05hbWUoY2xhc3NOYW1lKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmQoY29tcG9uZW50KSB7XHJcbiAgICAgIGxldCBjaGlsZHJlbiA9IFJlYWN0Q2hpbGRyZW4uZ2V0Q2hpbGRyZW5MaXN0KHRoaXMuX3N1YmplY3QpO1xyXG4gICAgICBjaGlsZHJlbi5wdXNoKGNvbXBvbmVudCk7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3AoJ2NoaWxkcmVuJywgY2hpbGRyZW4pO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXBlbmQoY29tcG9uZW50KSB7XHJcbiAgICAgIGxldCBjaGlsZHJlbiA9IFJlYWN0Q2hpbGRyZW4uZ2V0Q2hpbGRyZW5MaXN0KHRoaXMuX3N1YmplY3QpO1xyXG4gICAgICBjaGlsZHJlbi51bnNoaWZ0KGNvbXBvbmVudCk7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3AoJ2NoaWxkcmVuJywgY2hpbGRyZW4pO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVRyZWUoZm4pIHtcclxuICAgICAgdGhpcy5fc3ViamVjdCA9IFJlYWN0Q2hpbGRyZW4udHJhbnNmb3JtVHJlZSh0aGlzLl9zdWJqZWN0LCBmbik7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHRhcChmbikge1xyXG4gICAgICBmbih0aGlzLl9zdWJqZWN0KTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgd2Fsa1RyZWUoZm4pIHtcclxuICAgICAgbGV0IHRyZWUgPSBSZWFjdENoaWxkcmVuLm1hcFRyZWUodGhpcy5fc3ViamVjdCwgXy5pZGVudGl0eSk7XHJcbiAgICAgIHRyZWUuZm9yRWFjaChmbik7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGVuZGVuZCgpIHtcclxuICAgICAgbGV0IF9zdWJqZWN0ID0gdGhpcy5fc3ViamVjdDtcclxuICAgICAgdGhpcy5fc3ViamVjdCA9IG51bGw7XHJcbiAgICAgIHJldHVybiBfc3ViamVjdDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKCQucHJvdG90eXBlLCAvKiogQGxlbmRzICQucHJvdG90eXBlICove1xyXG4gICAgX3N1YmplY3Q6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiAkO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=