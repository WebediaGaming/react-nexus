"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;
  var should = R.should;
  var React = R.React;

  /**
  * <p>Defines a specific mixin</p>
  * <p>This will allow to components to access the main methods of react-rails</p>
  * <ul>
  * <li> Component.getFlux => Provide Flux for the current component </li>
  * </ul>
  * @class R.Component
  */
  var Component = {
    Mixin: {
      /**
      * <p>Refers to specifics mixins in order to manage Pure, Async, Animate and Flux methods</p>
      * @property mixins
      * @type {array.object}
      */
      mixins: [R.Pure.Mixin, R.Async.Mixin, R.Animate.Mixin, R.Flux.Mixin],
      /**
      * <p>Defines context object for the current component<br />
      * Allows all components using this mixin to have reference to R.Flux (Provides by the R.Root)</p>
      * @property contextTypes
      * @type {object} flux
      */
      contextTypes: {
        flux: R.Flux.PropType },

      _ComponentMixinHasComponentMixin: true,
      /** <p>Provide Flux for the current component</p>
      * @method getFlux
      * @return {object} this.context.flux The Flux of the App
      */
      getFlux: function () {
        return this.context.flux;
      } } };

  return Component;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkNvbXBvbmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDOzs7Ozs7Ozs7O0FBVXRCLE1BQU0sU0FBUyxHQUFHO0FBQ2hCLFNBQUssRUFBRTs7Ozs7O0FBTUwsWUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Ozs7Ozs7QUFPcEUsa0JBQVksRUFBRTtBQUNaLFlBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFDdEI7O0FBRUQsc0NBQWdDLEVBQUUsSUFBSTs7Ozs7QUFLdEMsYUFBTyxFQUFBLFlBQUc7QUFDUixlQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO09BQzFCLEVBQ0YsRUFDRixDQUFDOztBQUVGLFNBQU8sU0FBUyxDQUFDO0NBQ2xCLENBQUMiLCJmaWxlIjoiUi5Db21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XHJcbiAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xyXG5cclxuICAvKipcclxuICAqIDxwPkRlZmluZXMgYSBzcGVjaWZpYyBtaXhpbjwvcD5cclxuICAqIDxwPlRoaXMgd2lsbCBhbGxvdyB0byBjb21wb25lbnRzIHRvIGFjY2VzcyB0aGUgbWFpbiBtZXRob2RzIG9mIHJlYWN0LXJhaWxzPC9wPlxyXG4gICogPHVsPlxyXG4gICogPGxpPiBDb21wb25lbnQuZ2V0Rmx1eCA9PiBQcm92aWRlIEZsdXggZm9yIHRoZSBjdXJyZW50IGNvbXBvbmVudCA8L2xpPlxyXG4gICogPC91bD5cclxuICAqIEBjbGFzcyBSLkNvbXBvbmVudFxyXG4gICovXHJcbiAgY29uc3QgQ29tcG9uZW50ID0ge1xyXG4gICAgTWl4aW46IHtcclxuICAgICAgLyoqXHJcbiAgICAgICogPHA+UmVmZXJzIHRvIHNwZWNpZmljcyBtaXhpbnMgaW4gb3JkZXIgdG8gbWFuYWdlIFB1cmUsIEFzeW5jLCBBbmltYXRlIGFuZCBGbHV4IG1ldGhvZHM8L3A+XHJcbiAgICAgICogQHByb3BlcnR5IG1peGluc1xyXG4gICAgICAqIEB0eXBlIHthcnJheS5vYmplY3R9XHJcbiAgICAgICovXHJcbiAgICAgIG1peGluczogW1IuUHVyZS5NaXhpbiwgUi5Bc3luYy5NaXhpbiwgUi5BbmltYXRlLk1peGluLCBSLkZsdXguTWl4aW5dLFxyXG4gICAgICAvKipcclxuICAgICAgKiA8cD5EZWZpbmVzIGNvbnRleHQgb2JqZWN0IGZvciB0aGUgY3VycmVudCBjb21wb25lbnQ8YnIgLz5cclxuICAgICAgKiBBbGxvd3MgYWxsIGNvbXBvbmVudHMgdXNpbmcgdGhpcyBtaXhpbiB0byBoYXZlIHJlZmVyZW5jZSB0byBSLkZsdXggKFByb3ZpZGVzIGJ5IHRoZSBSLlJvb3QpPC9wPlxyXG4gICAgICAqIEBwcm9wZXJ0eSBjb250ZXh0VHlwZXNcclxuICAgICAgKiBAdHlwZSB7b2JqZWN0fSBmbHV4XHJcbiAgICAgICovXHJcbiAgICAgIGNvbnRleHRUeXBlczoge1xyXG4gICAgICAgIGZsdXg6IFIuRmx1eC5Qcm9wVHlwZSxcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9Db21wb25lbnRNaXhpbkhhc0NvbXBvbmVudE1peGluOiB0cnVlLFxyXG4gICAgICAvKiogPHA+UHJvdmlkZSBGbHV4IGZvciB0aGUgY3VycmVudCBjb21wb25lbnQ8L3A+XHJcbiAgICAgICogQG1ldGhvZCBnZXRGbHV4XHJcbiAgICAgICogQHJldHVybiB7b2JqZWN0fSB0aGlzLmNvbnRleHQuZmx1eCBUaGUgRmx1eCBvZiB0aGUgQXBwXHJcbiAgICAgICovXHJcbiAgICAgIGdldEZsdXgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5mbHV4O1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9O1xyXG5cclxuICByZXR1cm4gQ29tcG9uZW50O1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=