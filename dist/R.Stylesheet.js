"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = require("lodash");
  var assert = require("assert");

  var Stylesheet = function Stylesheet() {
    this._rules = [];
  };

  _.extend(Stylesheet.prototype, /** @lends R.Stylesheet.prototype */{
    _isStylesheet_: true,
    registerRule: function registerRule(selector, style) {
      R.Debug.dev(function () {
        assert(_.isPlainObject(style), "R.Stylesheet.registerClassName(...).style: expecting Object.");
      });
      this._rules.push({
        selector: selector,
        style: style });
    },
    getProcessedCSS: function getProcessedCSS() {
      return R.Style.applyAllProcessors(_.map(this._rules, function (rule) {
        return rule.selector + " {\n" + R.Style.getCSSFromReactStyle(rule.style, "  ") + "}\n";
      }).join("\n"));
    } });

  return Stylesheet;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6L3dvcmtzcGFjZV9wci9yZWFjdC1yYWlscy9zcmMvUi5TdHlsZXNoZWV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQ3pCLE1BQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQixNQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRS9CLE1BQUksVUFBVSxHQUFHLFNBQVMsVUFBVSxHQUFHO0FBQ25DLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0dBQ3BCLENBQUM7O0FBRUYsR0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxzQ0FBdUM7QUFDaEUsa0JBQWMsRUFBRSxJQUFJO0FBQ3BCLGdCQUFZLEVBQUUsU0FBUyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRTtBQUNqRCxPQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFXO0FBQ25CLGNBQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLDhEQUE4RCxDQUFDLENBQUM7T0FDbEcsQ0FBQyxDQUFDO0FBQ0gsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDYixnQkFBUSxFQUFFLFFBQVE7QUFDbEIsYUFBSyxFQUFFLEtBQUssRUFDZixDQUFDLENBQUM7S0FDTjtBQUNELG1CQUFlLEVBQUUsU0FBUyxlQUFlLEdBQUc7QUFDeEMsYUFBTyxDQUFDLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFTLElBQUksRUFBRTtBQUNoRSxlQUFPLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7T0FDMUYsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ2xCLEVBQ0osQ0FBQyxDQUFDOztBQUVILFNBQU8sVUFBVSxDQUFDIiwiZmlsZSI6IlIuU3R5bGVzaGVldC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgICB2YXIgXyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XHJcbiAgICB2YXIgYXNzZXJ0ID0gcmVxdWlyZShcImFzc2VydFwiKTtcclxuXHJcbiAgICB2YXIgU3R5bGVzaGVldCA9IGZ1bmN0aW9uIFN0eWxlc2hlZXQoKSB7XHJcbiAgICAgICAgdGhpcy5fcnVsZXMgPSBbXTtcclxuICAgIH07XHJcblxyXG4gICAgXy5leHRlbmQoU3R5bGVzaGVldC5wcm90b3R5cGUsIC8qKiBAbGVuZHMgUi5TdHlsZXNoZWV0LnByb3RvdHlwZSAqLyB7XHJcbiAgICAgICAgX2lzU3R5bGVzaGVldF86IHRydWUsXHJcbiAgICAgICAgcmVnaXN0ZXJSdWxlOiBmdW5jdGlvbiByZWdpc3RlclJ1bGUoc2VsZWN0b3IsIHN0eWxlKSB7XHJcbiAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgYXNzZXJ0KF8uaXNQbGFpbk9iamVjdChzdHlsZSksIFwiUi5TdHlsZXNoZWV0LnJlZ2lzdGVyQ2xhc3NOYW1lKC4uLikuc3R5bGU6IGV4cGVjdGluZyBPYmplY3QuXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fcnVsZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXHJcbiAgICAgICAgICAgICAgICBzdHlsZTogc3R5bGUsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0UHJvY2Vzc2VkQ1NTOiBmdW5jdGlvbiBnZXRQcm9jZXNzZWRDU1MoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBSLlN0eWxlLmFwcGx5QWxsUHJvY2Vzc29ycyhfLm1hcCh0aGlzLl9ydWxlcywgZnVuY3Rpb24ocnVsZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJ1bGUuc2VsZWN0b3IgKyBcIiB7XFxuXCIgKyBSLlN0eWxlLmdldENTU0Zyb21SZWFjdFN0eWxlKHJ1bGUuc3R5bGUsIFwiICBcIikgKyBcIn1cXG5cIjtcclxuICAgICAgICAgICAgfSkuam9pbihcIlxcblwiKSk7XHJcbiAgICAgICAgfSxcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBTdHlsZXNoZWV0O1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=