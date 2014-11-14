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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6L3dvcmtzcGFjZV9wci9yZWFjdC1yYWlscy9zcmMvUi4kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7TUFFaEIsQ0FBQztRQUFELENBQUMsR0FDTSxTQURQLENBQUMsQ0FDTyxTQUFTLEVBQUU7QUFDckIsVUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7S0FDM0I7O2dCQUhHLENBQUM7QUFLTCxTQUFHOztlQUFBLFlBQUc7QUFDSixpQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3RCOztBQUVELFVBQUk7O2VBQUEsVUFBQyxPQUFPLEVBQUU7QUFDWixjQUFHLE9BQU8sRUFBRTtBQUNWLGdCQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdDLG1CQUFPLElBQUksQ0FBQztXQUNiLE1BQ0k7QUFDSCxtQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztXQUMzQjtTQUNGOztBQUVELFVBQUk7O2VBQUEsVUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBQ2hCLGNBQUcsTUFBTSxFQUFFO0FBQ1QsZ0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4RCxnQkFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FB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Qzs7O0FBb0hQLEdBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsMkJBQTJCO0FBQzdDLFlBQVEsRUFBRSxJQUFJLEVBQ2YsQ0FBQyxDQUFDOztBQUVILFNBQU8sQ0FBQyxDQUFDO0NBQ1YsQ0FBQyIsImZpbGUiOiJSLiQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XHJcbiAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xyXG5cclxuICBjbGFzcyAkIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbXBvbmVudCkge1xyXG4gICAgICB0aGlzLl9zdWJqZWN0ID0gY29tcG9uZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3N1YmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgdHlwZShvcHRUeXBlKSB7XHJcbiAgICAgIGlmKG9wdFR5cGUpIHtcclxuICAgICAgICB0aGlzLl9zdWJqZWN0ID0gb3B0VHlwZSh0aGlzLl9zdWJqZWN0LnByb3BzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3ViamVjdC50eXBlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvcChrZXksIG9wdFZhbCkge1xyXG4gICAgICBpZihvcHRWYWwpIHtcclxuICAgICAgICB0aGlzLl9zdWJqZWN0ID0gdGhpcy5fc3ViamVjdC50eXBlKHRoaXMuX3N1YmplY3QucHJvcHMpO1xyXG4gICAgICAgIHRoaXMuX3N1YmplY3QucHJvcHNba2V5XSA9IG9wdFZhbDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3ViamVjdC5wcm9wc1trZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvcHMoYXJnKSB7XHJcbiAgICAgIGlmKF8uaXNBcnJheShhcmcpKSB7XHJcbiAgICAgICAgcmV0dXJuIF8ub2JqZWN0KGFyZy5tYXAoKHZhbCwga2V5KSA9PiBba2V5LCB0aGlzLl9zdWJqZWN0LnByb3BzW2tleV1dKSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fc3ViamVjdCA9IHRoaXMuX3N1YmplY3QudHlwZSh0aGlzLl9zdWJqZWN0LnByb3BzKTtcclxuICAgICAgICBhcmcuZm9yRWFjaCgodmFsLCBrZXkpID0+IHRoaXMuX3N1YmplY3QucHJvcHNba2V5XSA9IHZhbCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGFzc05hbWVMaXN0KG9wdFZhbCkge1xyXG4gICAgICBpZihvcHRWYWwpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wKCdjbGFzc05hbWUnLCBvcHRWYWwuam9pbignICcpKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMucHJvcCgnY2xhc3NOYW1lJykgfHwgJycpLnNwbGl0KCcgJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhZGRDbGFzc05hbWUoY2xhc3NOYW1lKSB7XHJcbiAgICAgIGxldCBjeCA9IHRoaXMuY2xhc3NOYW1lTGlzdCgpO1xyXG4gICAgICBjeC5wdXNoKGNsYXNzTmFtZSk7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3AoJ2NsYXNzTmFtZScsIF8udW5pcShjeCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUNsYXNzTmFtZShjbGFzc05hbWUpIHtcclxuICAgICAgbGV0IGN4ID0gdGhpcy5jbGFzc05hbWVMaXN0KCk7XHJcbiAgICAgIGN4ID0gXy53aXRob3V0KGN4LCBjbGFzc05hbWUpO1xyXG4gICAgICByZXR1cm4gdGhpcy5wcm9wKCdjbGFzc05hbWUnLCBjeCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFzQ2xhc3NOYW1lKGNsYXNzTmFtZSkge1xyXG4gICAgICBsZXQgY3ggPSB0aGlzLmNsYXNzTmFtZUxpc3QoKTtcclxuICAgICAgcmV0dXJuIF8uY29udGFpbnMoY3gsIGNsYXNzTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlQ2xhc3NOYW1lKGNsYXNzTmFtZSwgb3B0VmFsKSB7XHJcbiAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKG9wdFZhbCkpIHtcclxuICAgICAgICBpZihvcHRWYWwpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLmFkZENsYXNzTmFtZShjbGFzc05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUNsYXNzTmFtZShjbGFzc05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50b2dnbGVDbGFzc05hbWUoY2xhc3NOYW1lLCAhdGhpcy5oYXNDbGFzc05hbWUoY2xhc3NOYW1lKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmQoY29tcG9uZW50KSB7XHJcbiAgICAgIGxldCBjaGlsZHJlbiA9IFJlYWN0Q2hpbGRyZW4uZ2V0Q2hpbGRyZW5MaXN0KHRoaXMuX3N1YmplY3QpO1xyXG4gICAgICBjaGlsZHJlbi5wdXNoKGNvbXBvbmVudCk7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3AoJ2NoaWxkcmVuJywgY2hpbGRyZW4pO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXBlbmQoY29tcG9uZW50KSB7XHJcbiAgICAgIGxldCBjaGlsZHJlbiA9IFJlYWN0Q2hpbGRyZW4uZ2V0Q2hpbGRyZW5MaXN0KHRoaXMuX3N1YmplY3QpO1xyXG4gICAgICBjaGlsZHJlbi51bnNoaWZ0KGNvbXBvbmVudCk7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3AoJ2NoaWxkcmVuJywgY2hpbGRyZW4pO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybVRyZWUoZm4pIHtcclxuICAgICAgdGhpcy5fc3ViamVjdCA9IFJlYWN0Q2hpbGRyZW4udHJhbnNmb3JtVHJlZSh0aGlzLl9zdWJqZWN0LCBmbik7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHRhcChmbikge1xyXG4gICAgICBmbih0aGlzLl9zdWJqZWN0KTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgd2Fsa1RyZWUoZm4pIHtcclxuICAgICAgbGV0IHRyZWUgPSBSZWFjdENoaWxkcmVuLm1hcFRyZWUodGhpcy5fc3ViamVjdCwgXy5pZGVudGl0eSk7XHJcbiAgICAgIHRyZWUuZm9yRWFjaChmbik7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGVuZGVuZCgpIHtcclxuICAgICAgbGV0IF9zdWJqZWN0ID0gdGhpcy5fc3ViamVjdDtcclxuICAgICAgdGhpcy5fc3ViamVjdCA9IG51bGw7XHJcbiAgICAgIHJldHVybiBfc3ViamVjdDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKCQucHJvdG90eXBlLCAvKiogQGxlbmRzICQucHJvdG90eXBlICove1xyXG4gICAgX3N1YmplY3Q6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiAkO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=