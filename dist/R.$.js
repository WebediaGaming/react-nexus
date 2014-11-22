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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LW5leHVzL3NyYy9SLiQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7O01BRWhCLENBQUM7UUFBRCxDQUFDLEdBQ00sU0FEUCxDQUFDLENBQ08sU0FBUyxFQUFFO0FBQ3JCLFVBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO0tBQzNCOztnQkFIRyxDQUFDO0FBS0wsU0FBRzs7ZUFBQSxZQUFHO0FBQ0osaUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN0Qjs7QUFFRCxVQUFJOztlQUFBLFVBQUMsT0FBTyxFQUFFO0FBQ1osY0FBRyxPQUFPLEVBQUU7QUFDVixnQkFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QyxtQkFBTyxJQUFJLENBQUM7V0FDYixNQUNJO0FBQ0gsbUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7V0FDM0I7U0FDRjs7QUFFRCxVQUFJOztlQUFBLFVBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRTtBQUNoQixjQUFHLE1BQU0sRUFBRTtBQUNULGdCQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEQsZ0JBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUNsQyxtQkFBTyxJQUFJLENBQUM7V0FDYixNQUNJO0FBQ0gsbUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7V0FDakM7U0FDRjs7QUFFRCxXQUFLOztlQUFBLFVBQUMsR0FBRyxFQUFFOzs7QUFDVCxjQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDakIsbUJBQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBRyxFQUFFLEdBQUc7cUJBQUssQ0FBQyxHQUFHLEVBQUUsTUFBSyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQUEsQ0FBQyxDQUFDLENBQUM7V0FDekUsTUFDSTtBQUNILGdCQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEQsZUFBRyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBRSxHQUFHO3FCQUFLLE1BQUssUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHO2FBQUEsQ0FBQyxDQUFDO0FBQzFELG1CQUFPLElBQUksQ0FBQztXQUNiO1NBQ0Y7O0FBRUQsbUJBQWE7O2VBQUEsVUFBQyxNQUFNLEVBQUU7QUFDcEIsY0FBRyxNQUFNLEVBQUU7QUFDVCxtQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7V0FDakQsTUFDSTtBQUNILG1CQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7V0FDbEQ7U0FDRjs7QUFFRCxrQkFBWTs7ZUFBQSxVQUFDLFNBQVMsRUFBRTtBQUN0QixjQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDOUIsWUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuQixpQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDM0M7O0FBRUQscUJBQWU7O2VBQUEsVUFBQyxTQUFTLEVBQUU7QUFDekIsY0FBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQzlCLFlBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM5QixpQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUNuQzs7QUFFRCxrQkFBWTs7ZUFBQSxVQUFDLFNBQVMsRUFBRTtBQUN0QixjQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDOUIsaUJBQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDbEM7O0FBRUQscUJBQWU7O2VBQUEsVUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFO0FBQ2pDLGNBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ3pCLGdCQUFHLE1BQU0sRUFBRTtBQUNULHFCQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDckMsTUFDSTtBQUNILHFCQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDeEM7V0FDRixNQUNJO0FBQ0gsbUJBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7V0FDdkU7U0FDRjs7QUFFRCxZQUFNOztlQUFBLFVBQUMsU0FBUyxFQUFFO0FBQ2hCLGNBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3RCxrQkFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN6QixpQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUN4Qzs7QUFFRCxhQUFPOztlQUFBLFVBQUMsU0FBUyxFQUFFO0FBQ2pCLGNBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3RCxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1QixpQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUN4Qzs7QUFFRCxtQkFBYTs7ZUFBQSxVQUFDLEVBQUUsRUFBRTtBQUNoQixjQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDaEUsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7O0FBRUQsU0FBRzs7ZUFBQSxVQUFDLEVBQUUsRUFBRTtBQUNOLFlBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbEIsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7O0FBRUQsY0FBUTs7ZUFBQSxVQUFDLEVBQUUsRUFBRTtBQUNYLGNBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdELGNBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakIsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7O0FBRUQsWUFBTTs7ZUFBQSxZQUFHO0FBQ1AsY0FBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUM3QixjQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUNyQixpQkFBTyxRQUFRLENBQUM7U0FDakI7Ozs7V0FqSEcsQ0FBQzs7Ozs7QUFvSFAsR0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUywyQkFBMkI7QUFDN0MsWUFBUSxFQUFFLElBQUksRUFDZixDQUFDLENBQUM7O0FBRUgsU0FBTyxDQUFDLENBQUM7Q0FDVixDQUFDIiwiZmlsZSI6IlIuJC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCBSZWFjdCA9IFIuUmVhY3Q7XHJcblxyXG4gIGNsYXNzICQge1xyXG4gICAgY29uc3RydWN0b3IoY29tcG9uZW50KSB7XHJcbiAgICAgIHRoaXMuX3N1YmplY3QgPSBjb21wb25lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fc3ViamVjdDtcclxuICAgIH1cclxuXHJcbiAgICB0eXBlKG9wdFR5cGUpIHtcclxuICAgICAgaWYob3B0VHlwZSkge1xyXG4gICAgICAgIHRoaXMuX3N1YmplY3QgPSBvcHRUeXBlKHRoaXMuX3N1YmplY3QucHJvcHMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdWJqZWN0LnR5cGU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm9wKGtleSwgb3B0VmFsKSB7XHJcbiAgICAgIGlmKG9wdFZhbCkge1xyXG4gICAgICAgIHRoaXMuX3N1YmplY3QgPSB0aGlzLl9zdWJqZWN0LnR5cGUodGhpcy5fc3ViamVjdC5wcm9wcyk7XHJcbiAgICAgICAgdGhpcy5fc3ViamVjdC5wcm9wc1trZXldID0gb3B0VmFsO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdWJqZWN0LnByb3BzW2tleV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm9wcyhhcmcpIHtcclxuICAgICAgaWYoXy5pc0FycmF5KGFyZykpIHtcclxuICAgICAgICByZXR1cm4gXy5vYmplY3QoYXJnLm1hcCgodmFsLCBrZXkpID0+IFtrZXksIHRoaXMuX3N1YmplY3QucHJvcHNba2V5XV0pKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLl9zdWJqZWN0ID0gdGhpcy5fc3ViamVjdC50eXBlKHRoaXMuX3N1YmplY3QucHJvcHMpO1xyXG4gICAgICAgIGFyZy5mb3JFYWNoKCh2YWwsIGtleSkgPT4gdGhpcy5fc3ViamVjdC5wcm9wc1trZXldID0gdmFsKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzTmFtZUxpc3Qob3B0VmFsKSB7XHJcbiAgICAgIGlmKG9wdFZhbCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb3AoJ2NsYXNzTmFtZScsIG9wdFZhbC5qb2luKCcgJykpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5wcm9wKCdjbGFzc05hbWUnKSB8fCAnJykuc3BsaXQoJyAnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZENsYXNzTmFtZShjbGFzc05hbWUpIHtcclxuICAgICAgbGV0IGN4ID0gdGhpcy5jbGFzc05hbWVMaXN0KCk7XHJcbiAgICAgIGN4LnB1c2goY2xhc3NOYW1lKTtcclxuICAgICAgcmV0dXJuIHRoaXMucHJvcCgnY2xhc3NOYW1lJywgXy51bmlxKGN4KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQ2xhc3NOYW1lKGNsYXNzTmFtZSkge1xyXG4gICAgICBsZXQgY3ggPSB0aGlzLmNsYXNzTmFtZUxpc3QoKTtcclxuICAgICAgY3ggPSBfLndpdGhvdXQoY3gsIGNsYXNzTmFtZSk7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3AoJ2NsYXNzTmFtZScsIGN4KTtcclxuICAgIH1cclxuXHJcbiAgICBoYXNDbGFzc05hbWUoY2xhc3NOYW1lKSB7XHJcbiAgICAgIGxldCBjeCA9IHRoaXMuY2xhc3NOYW1lTGlzdCgpO1xyXG4gICAgICByZXR1cm4gXy5jb250YWlucyhjeCwgY2xhc3NOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVDbGFzc05hbWUoY2xhc3NOYW1lLCBvcHRWYWwpIHtcclxuICAgICAgaWYoIV8uaXNVbmRlZmluZWQob3B0VmFsKSkge1xyXG4gICAgICAgIGlmKG9wdFZhbCkge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuYWRkQ2xhc3NOYW1lKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlQ2xhc3NOYW1lKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvZ2dsZUNsYXNzTmFtZShjbGFzc05hbWUsICF0aGlzLmhhc0NsYXNzTmFtZShjbGFzc05hbWUpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZChjb21wb25lbnQpIHtcclxuICAgICAgbGV0IGNoaWxkcmVuID0gUmVhY3QuQ2hpbGRyZW4uZ2V0Q2hpbGRyZW5MaXN0KHRoaXMuX3N1YmplY3QpO1xyXG4gICAgICBjaGlsZHJlbi5wdXNoKGNvbXBvbmVudCk7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3AoJ2NoaWxkcmVuJywgY2hpbGRyZW4pO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXBlbmQoY29tcG9uZW50KSB7XHJcbiAgICAgIGxldCBjaGlsZHJlbiA9IFJlYWN0LkNoaWxkcmVuLmdldENoaWxkcmVuTGlzdCh0aGlzLl9zdWJqZWN0KTtcclxuICAgICAgY2hpbGRyZW4udW5zaGlmdChjb21wb25lbnQpO1xyXG4gICAgICByZXR1cm4gdGhpcy5wcm9wKCdjaGlsZHJlbicsIGNoaWxkcmVuKTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm1UcmVlKGZuKSB7XHJcbiAgICAgIHRoaXMuX3N1YmplY3QgPSBSZWFjdC5DaGlsZHJlbi50cmFuc2Zvcm1UcmVlKHRoaXMuX3N1YmplY3QsIGZuKTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgdGFwKGZuKSB7XHJcbiAgICAgIGZuKHRoaXMuX3N1YmplY3QpO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICB3YWxrVHJlZShmbikge1xyXG4gICAgICBsZXQgdHJlZSA9IFJlYWN0LkNoaWxkcmVuLm1hcFRyZWUodGhpcy5fc3ViamVjdCwgXy5pZGVudGl0eSk7XHJcbiAgICAgIHRyZWUuZm9yRWFjaChmbik7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGVuZGVuZCgpIHtcclxuICAgICAgbGV0IF9zdWJqZWN0ID0gdGhpcy5fc3ViamVjdDtcclxuICAgICAgdGhpcy5fc3ViamVjdCA9IG51bGw7XHJcbiAgICAgIHJldHVybiBfc3ViamVjdDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKCQucHJvdG90eXBlLCAvKiogQGxlbmRzICQucHJvdG90eXBlICove1xyXG4gICAgX3N1YmplY3Q6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiAkO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=