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

  _.extend($.prototype, /** @lends $.prototype */{
    _subject: null });

  return $;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLiQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLENBQUM7UUFBRCxDQUFDLEdBQ00sU0FEUCxDQUFDLENBQ08sU0FBUyxFQUFFO0FBQ3JCLFVBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO0tBQzNCOztnQkFIRyxDQUFDO0FBS0wsU0FBRzs7ZUFBQSxZQUFHO0FBQ0osaUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN0Qjs7QUFFRCxVQUFJOztlQUFBLFVBQUMsT0FBTyxFQUFFO0FBQ1osY0FBRyxPQUFPLEVBQUU7QUFDVixnQkFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QyxtQkFBTyxJQUFJLENBQUM7V0FDYixNQUNJO0FBQ0gsbUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7V0FDM0I7U0FDRjs7QUFFRCxVQUFJOztlQUFBLFVBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRTtBQUNoQixjQUFHLE1BQU0sRUFBRTtBQUNULGdCQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEQsZ0JBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUNsQyxtQkFB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LENBQUMsQ0FBQyxTQUFTLDJCQUEyQjtBQUM3QyxZQUFRLEVBQUUsSUFBSSxFQUNmLENBQUMsQ0FBQzs7QUFFSCxTQUFPLENBQUMsQ0FBQztDQUNWLENBQUMiLCJmaWxlIjoiUi4kLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG5cbiAgY2xhc3MgJCB7XG4gICAgY29uc3RydWN0b3IoY29tcG9uZW50KSB7XG4gICAgICB0aGlzLl9zdWJqZWN0ID0gY29tcG9uZW50O1xuICAgIH1cblxuICAgIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdWJqZWN0O1xuICAgIH1cblxuICAgIHR5cGUob3B0VHlwZSkge1xuICAgICAgaWYob3B0VHlwZSkge1xuICAgICAgICB0aGlzLl9zdWJqZWN0ID0gb3B0VHlwZSh0aGlzLl9zdWJqZWN0LnByb3BzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1YmplY3QudHlwZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9wKGtleSwgb3B0VmFsKSB7XG4gICAgICBpZihvcHRWYWwpIHtcbiAgICAgICAgdGhpcy5fc3ViamVjdCA9IHRoaXMuX3N1YmplY3QudHlwZSh0aGlzLl9zdWJqZWN0LnByb3BzKTtcbiAgICAgICAgdGhpcy5fc3ViamVjdC5wcm9wc1trZXldID0gb3B0VmFsO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3ViamVjdC5wcm9wc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByb3BzKGFyZykge1xuICAgICAgaWYoXy5pc0FycmF5KGFyZykpIHtcbiAgICAgICAgcmV0dXJuIF8ub2JqZWN0KGFyZy5tYXAoKHZhbCwga2V5KSA9PiBba2V5LCB0aGlzLl9zdWJqZWN0LnByb3BzW2tleV1dKSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5fc3ViamVjdCA9IHRoaXMuX3N1YmplY3QudHlwZSh0aGlzLl9zdWJqZWN0LnByb3BzKTtcbiAgICAgICAgYXJnLmZvckVhY2goKHZhbCwga2V5KSA9PiB0aGlzLl9zdWJqZWN0LnByb3BzW2tleV0gPSB2YWwpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzc05hbWVMaXN0KG9wdFZhbCkge1xuICAgICAgaWYob3B0VmFsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3AoJ2NsYXNzTmFtZScsIG9wdFZhbC5qb2luKCcgJykpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiAodGhpcy5wcm9wKCdjbGFzc05hbWUnKSB8fCAnJykuc3BsaXQoJyAnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRDbGFzc05hbWUoY2xhc3NOYW1lKSB7XG4gICAgICBsZXQgY3ggPSB0aGlzLmNsYXNzTmFtZUxpc3QoKTtcbiAgICAgIGN4LnB1c2goY2xhc3NOYW1lKTtcbiAgICAgIHJldHVybiB0aGlzLnByb3AoJ2NsYXNzTmFtZScsIF8udW5pcShjeCkpO1xuICAgIH1cblxuICAgIHJlbW92ZUNsYXNzTmFtZShjbGFzc05hbWUpIHtcbiAgICAgIGxldCBjeCA9IHRoaXMuY2xhc3NOYW1lTGlzdCgpO1xuICAgICAgY3ggPSBfLndpdGhvdXQoY3gsIGNsYXNzTmFtZSk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wKCdjbGFzc05hbWUnLCBjeCk7XG4gICAgfVxuXG4gICAgaGFzQ2xhc3NOYW1lKGNsYXNzTmFtZSkge1xuICAgICAgbGV0IGN4ID0gdGhpcy5jbGFzc05hbWVMaXN0KCk7XG4gICAgICByZXR1cm4gXy5jb250YWlucyhjeCwgY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICB0b2dnbGVDbGFzc05hbWUoY2xhc3NOYW1lLCBvcHRWYWwpIHtcbiAgICAgIGlmKCFfLmlzVW5kZWZpbmVkKG9wdFZhbCkpIHtcbiAgICAgICAgaWYob3B0VmFsKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYWRkQ2xhc3NOYW1lKGNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlQ2xhc3NOYW1lKGNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy50b2dnbGVDbGFzc05hbWUoY2xhc3NOYW1lLCAhdGhpcy5oYXNDbGFzc05hbWUoY2xhc3NOYW1lKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXBwZW5kKGNvbXBvbmVudCkge1xuICAgICAgbGV0IGNoaWxkcmVuID0gUmVhY3RDaGlsZHJlbi5nZXRDaGlsZHJlbkxpc3QodGhpcy5fc3ViamVjdCk7XG4gICAgICBjaGlsZHJlbi5wdXNoKGNvbXBvbmVudCk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wKCdjaGlsZHJlbicsIGNoaWxkcmVuKTtcbiAgICB9XG5cbiAgICBwcmVwZW5kKGNvbXBvbmVudCkge1xuICAgICAgbGV0IGNoaWxkcmVuID0gUmVhY3RDaGlsZHJlbi5nZXRDaGlsZHJlbkxpc3QodGhpcy5fc3ViamVjdCk7XG4gICAgICBjaGlsZHJlbi51bnNoaWZ0KGNvbXBvbmVudCk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wKCdjaGlsZHJlbicsIGNoaWxkcmVuKTtcbiAgICB9XG5cbiAgICB0cmFuc2Zvcm1UcmVlKGZuKSB7XG4gICAgICB0aGlzLl9zdWJqZWN0ID0gUmVhY3RDaGlsZHJlbi50cmFuc2Zvcm1UcmVlKHRoaXMuX3N1YmplY3QsIGZuKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRhcChmbikge1xuICAgICAgZm4odGhpcy5fc3ViamVjdCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB3YWxrVHJlZShmbikge1xuICAgICAgbGV0IHRyZWUgPSBSZWFjdENoaWxkcmVuLm1hcFRyZWUodGhpcy5fc3ViamVjdCwgXy5pZGVudGl0eSk7XG4gICAgICB0cmVlLmZvckVhY2goZm4pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZW5kZW5kKCkge1xuICAgICAgbGV0IF9zdWJqZWN0ID0gdGhpcy5fc3ViamVjdDtcbiAgICAgIHRoaXMuX3N1YmplY3QgPSBudWxsO1xuICAgICAgcmV0dXJuIF9zdWJqZWN0O1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKCQucHJvdG90eXBlLCAvKiogQGxlbmRzICQucHJvdG90eXBlICove1xuICAgIF9zdWJqZWN0OiBudWxsLFxuICB9KTtcblxuICByZXR1cm4gJDtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=