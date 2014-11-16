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

    return $;
  })();

  _.extend($.prototype, /** @lends $.prototype */{
    _subject: null });

  return $;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLiQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7TUFFaEIsQ0FBQztRQUFELENBQUMsR0FDTSxTQURQLENBQUMsQ0FDTyxTQUFTLEVBQUU7QUFDckIsVUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7S0FDM0I7O2dCQUhHLENBQUM7QUFLTCxTQUFHOztlQUFBLFlBQUc7QUFDSixpQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3RCOztBQUVELFVBQUk7O2VBQUEsVUFBQyxPQUFPLEVBQUU7QUFDWixjQUFHLE9BQU8sRUFBRTtBQUNWLGdCQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdDLG1CQUFPLElBQUksQ0FBQztXQUNiLE1BQ0k7QUFDSCxtQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztXQUMzQjtTQUNGOztBQUVELFVBQUk7O2VBQUEsVUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBQ2hCLGNBQUcsTUFBTSxFQUFFO0FBQ1QsZ0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4RCxnQkFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQ2xDLG1CQUFPLElBQUksQ0FB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OztBQW9IUCxHQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLDJCQUEyQjtBQUM3QyxZQUFRLEVBQUUsSUFBSSxFQUNmLENBQUMsQ0FBQzs7QUFFSCxTQUFPLENBQUMsQ0FBQztDQUNWLENBQUMiLCJmaWxlIjoiUi4kLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xuXG4gIGNsYXNzICQge1xuICAgIGNvbnN0cnVjdG9yKGNvbXBvbmVudCkge1xuICAgICAgdGhpcy5fc3ViamVjdCA9IGNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3ViamVjdDtcbiAgICB9XG5cbiAgICB0eXBlKG9wdFR5cGUpIHtcbiAgICAgIGlmKG9wdFR5cGUpIHtcbiAgICAgICAgdGhpcy5fc3ViamVjdCA9IG9wdFR5cGUodGhpcy5fc3ViamVjdC5wcm9wcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdWJqZWN0LnR5cGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJvcChrZXksIG9wdFZhbCkge1xuICAgICAgaWYob3B0VmFsKSB7XG4gICAgICAgIHRoaXMuX3N1YmplY3QgPSB0aGlzLl9zdWJqZWN0LnR5cGUodGhpcy5fc3ViamVjdC5wcm9wcyk7XG4gICAgICAgIHRoaXMuX3N1YmplY3QucHJvcHNba2V5XSA9IG9wdFZhbDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1YmplY3QucHJvcHNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9wcyhhcmcpIHtcbiAgICAgIGlmKF8uaXNBcnJheShhcmcpKSB7XG4gICAgICAgIHJldHVybiBfLm9iamVjdChhcmcubWFwKCh2YWwsIGtleSkgPT4gW2tleSwgdGhpcy5fc3ViamVjdC5wcm9wc1trZXldXSkpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX3N1YmplY3QgPSB0aGlzLl9zdWJqZWN0LnR5cGUodGhpcy5fc3ViamVjdC5wcm9wcyk7XG4gICAgICAgIGFyZy5mb3JFYWNoKCh2YWwsIGtleSkgPT4gdGhpcy5fc3ViamVjdC5wcm9wc1trZXldID0gdmFsKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3NOYW1lTGlzdChvcHRWYWwpIHtcbiAgICAgIGlmKG9wdFZhbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wKCdjbGFzc05hbWUnLCBvcHRWYWwuam9pbignICcpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gKHRoaXMucHJvcCgnY2xhc3NOYW1lJykgfHwgJycpLnNwbGl0KCcgJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkQ2xhc3NOYW1lKGNsYXNzTmFtZSkge1xuICAgICAgbGV0IGN4ID0gdGhpcy5jbGFzc05hbWVMaXN0KCk7XG4gICAgICBjeC5wdXNoKGNsYXNzTmFtZSk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wKCdjbGFzc05hbWUnLCBfLnVuaXEoY3gpKTtcbiAgICB9XG5cbiAgICByZW1vdmVDbGFzc05hbWUoY2xhc3NOYW1lKSB7XG4gICAgICBsZXQgY3ggPSB0aGlzLmNsYXNzTmFtZUxpc3QoKTtcbiAgICAgIGN4ID0gXy53aXRob3V0KGN4LCBjbGFzc05hbWUpO1xuICAgICAgcmV0dXJuIHRoaXMucHJvcCgnY2xhc3NOYW1lJywgY3gpO1xuICAgIH1cblxuICAgIGhhc0NsYXNzTmFtZShjbGFzc05hbWUpIHtcbiAgICAgIGxldCBjeCA9IHRoaXMuY2xhc3NOYW1lTGlzdCgpO1xuICAgICAgcmV0dXJuIF8uY29udGFpbnMoY3gsIGNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlQ2xhc3NOYW1lKGNsYXNzTmFtZSwgb3B0VmFsKSB7XG4gICAgICBpZighXy5pc1VuZGVmaW5lZChvcHRWYWwpKSB7XG4gICAgICAgIGlmKG9wdFZhbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmFkZENsYXNzTmFtZShjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUNsYXNzTmFtZShjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9nZ2xlQ2xhc3NOYW1lKGNsYXNzTmFtZSwgIXRoaXMuaGFzQ2xhc3NOYW1lKGNsYXNzTmFtZSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFwcGVuZChjb21wb25lbnQpIHtcbiAgICAgIGxldCBjaGlsZHJlbiA9IFJlYWN0LkNoaWxkcmVuLmdldENoaWxkcmVuTGlzdCh0aGlzLl9zdWJqZWN0KTtcbiAgICAgIGNoaWxkcmVuLnB1c2goY29tcG9uZW50KTtcbiAgICAgIHJldHVybiB0aGlzLnByb3AoJ2NoaWxkcmVuJywgY2hpbGRyZW4pO1xuICAgIH1cblxuICAgIHByZXBlbmQoY29tcG9uZW50KSB7XG4gICAgICBsZXQgY2hpbGRyZW4gPSBSZWFjdC5DaGlsZHJlbi5nZXRDaGlsZHJlbkxpc3QodGhpcy5fc3ViamVjdCk7XG4gICAgICBjaGlsZHJlbi51bnNoaWZ0KGNvbXBvbmVudCk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wKCdjaGlsZHJlbicsIGNoaWxkcmVuKTtcbiAgICB9XG5cbiAgICB0cmFuc2Zvcm1UcmVlKGZuKSB7XG4gICAgICB0aGlzLl9zdWJqZWN0ID0gUmVhY3QuQ2hpbGRyZW4udHJhbnNmb3JtVHJlZSh0aGlzLl9zdWJqZWN0LCBmbik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0YXAoZm4pIHtcbiAgICAgIGZuKHRoaXMuX3N1YmplY3QpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgd2Fsa1RyZWUoZm4pIHtcbiAgICAgIGxldCB0cmVlID0gUmVhY3QuQ2hpbGRyZW4ubWFwVHJlZSh0aGlzLl9zdWJqZWN0LCBfLmlkZW50aXR5KTtcbiAgICAgIHRyZWUuZm9yRWFjaChmbik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBlbmRlbmQoKSB7XG4gICAgICBsZXQgX3N1YmplY3QgPSB0aGlzLl9zdWJqZWN0O1xuICAgICAgdGhpcy5fc3ViamVjdCA9IG51bGw7XG4gICAgICByZXR1cm4gX3N1YmplY3Q7XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoJC5wcm90b3R5cGUsIC8qKiBAbGVuZHMgJC5wcm90b3R5cGUgKi97XG4gICAgX3N1YmplY3Q6IG51bGwsXG4gIH0pO1xuXG4gIHJldHVybiAkO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==