"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = require("lodash");

  var shouldComponentUpdate = function shouldComponentUpdate(props, state) {
    return !(_.isEqual(this.props, props) && _.isEqual(this.state, state));
  };

  /**
   * @memberof R
   * @type {Object}
   * @public
   */
  var Pure = /** @lends Pure */{
    /**
     * Implements React shouldComponentUpdate for pure components,
     * ie. update iff props or state has changed.
     * @type {Function}
     * @public
     */
    shouldComponentUpdate: shouldComponentUpdate,
    /**
     * Mixin for Pure components implementing the pure shouldComponentUpdate.
     * @type {Object}
     * @public
     */
    Mixin: {
      _PureMixinIsPure: true,
      shouldComponentUpdate: shouldComponentUpdate } };

  return Pure;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlB1cmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDekIsTUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUUxQixNQUFJLHFCQUFxQixHQUFHLFNBQVMscUJBQXFCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNyRSxXQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7R0FDMUUsQ0FBQzs7Ozs7OztBQU9GLE1BQUksSUFBSSxxQkFBcUI7Ozs7Ozs7QUFPekIseUJBQXFCLEVBQUUscUJBQXFCOzs7Ozs7QUFNNUMsU0FBSyxFQUFFO0FBQ0gsc0JBQWdCLEVBQUUsSUFBSTtBQUN0QiwyQkFBcUIsRUFBRSxxQkFBcUIsRUFDL0MsRUFDSixDQUFDOztBQUVGLFNBQU8sSUFBSSxDQUFDIiwiZmlsZSI6IlIuUHVyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgICB2YXIgXyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XHJcblxyXG4gICAgdmFyIHNob3VsZENvbXBvbmVudFVwZGF0ZSA9IGZ1bmN0aW9uIHNob3VsZENvbXBvbmVudFVwZGF0ZShwcm9wcywgc3RhdGUpIHtcclxuICAgICAgICByZXR1cm4gIShfLmlzRXF1YWwodGhpcy5wcm9wcywgcHJvcHMpICYmIF8uaXNFcXVhbCh0aGlzLnN0YXRlLCBzdGF0ZSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBtZW1iZXJvZiBSXHJcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICovXHJcbiAgICB2YXIgUHVyZSA9IC8qKiBAbGVuZHMgUHVyZSAqL3tcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbXBsZW1lbnRzIFJlYWN0IHNob3VsZENvbXBvbmVudFVwZGF0ZSBmb3IgcHVyZSBjb21wb25lbnRzLFxyXG4gICAgICAgICAqIGllLiB1cGRhdGUgaWZmIHByb3BzIG9yIHN0YXRlIGhhcyBjaGFuZ2VkLlxyXG4gICAgICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cclxuICAgICAgICAgKiBAcHVibGljXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBzaG91bGRDb21wb25lbnRVcGRhdGUsXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWl4aW4gZm9yIFB1cmUgY29tcG9uZW50cyBpbXBsZW1lbnRpbmcgdGhlIHB1cmUgc2hvdWxkQ29tcG9uZW50VXBkYXRlLlxyXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XHJcbiAgICAgICAgICogQHB1YmxpY1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIE1peGluOiB7XHJcbiAgICAgICAgICAgIF9QdXJlTWl4aW5Jc1B1cmU6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZTogc2hvdWxkQ29tcG9uZW50VXBkYXRlLFxyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBQdXJlO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=