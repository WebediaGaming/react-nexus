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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkNvbXBvbmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDOzs7Ozs7Ozs7O0FBVXRCLE1BQU0sU0FBUyxHQUFHO0FBQ2hCLFNBQUssRUFBRTs7Ozs7O0FBTUwsWUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Ozs7Ozs7QUFPcEUsa0JBQVksRUFBRTtBQUNaLFlBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFDdEI7O0FBRUQsc0NBQWdDLEVBQUUsSUFBSTs7Ozs7QUFLdEMsYUFBTyxFQUFBLFlBQUc7QUFDUixlQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO09BQzFCLEVBQ0YsRUFDRixDQUFDOztBQUVGLFNBQU8sU0FBUyxDQUFDO0NBQ2xCLENBQUMiLCJmaWxlIjoiUi5Db21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcbiAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xuXG4gIC8qKlxuICAqIDxwPkRlZmluZXMgYSBzcGVjaWZpYyBtaXhpbjwvcD5cbiAgKiA8cD5UaGlzIHdpbGwgYWxsb3cgdG8gY29tcG9uZW50cyB0byBhY2Nlc3MgdGhlIG1haW4gbWV0aG9kcyBvZiByZWFjdC1yYWlsczwvcD5cbiAgKiA8dWw+XG4gICogPGxpPiBDb21wb25lbnQuZ2V0Rmx1eCA9PiBQcm92aWRlIEZsdXggZm9yIHRoZSBjdXJyZW50IGNvbXBvbmVudCA8L2xpPlxuICAqIDwvdWw+XG4gICogQGNsYXNzIFIuQ29tcG9uZW50XG4gICovXG4gIGNvbnN0IENvbXBvbmVudCA9IHtcbiAgICBNaXhpbjoge1xuICAgICAgLyoqXG4gICAgICAqIDxwPlJlZmVycyB0byBzcGVjaWZpY3MgbWl4aW5zIGluIG9yZGVyIHRvIG1hbmFnZSBQdXJlLCBBc3luYywgQW5pbWF0ZSBhbmQgRmx1eCBtZXRob2RzPC9wPlxuICAgICAgKiBAcHJvcGVydHkgbWl4aW5zXG4gICAgICAqIEB0eXBlIHthcnJheS5vYmplY3R9XG4gICAgICAqL1xuICAgICAgbWl4aW5zOiBbUi5QdXJlLk1peGluLCBSLkFzeW5jLk1peGluLCBSLkFuaW1hdGUuTWl4aW4sIFIuRmx1eC5NaXhpbl0sXG4gICAgICAvKipcbiAgICAgICogPHA+RGVmaW5lcyBjb250ZXh0IG9iamVjdCBmb3IgdGhlIGN1cnJlbnQgY29tcG9uZW50PGJyIC8+XG4gICAgICAqIEFsbG93cyBhbGwgY29tcG9uZW50cyB1c2luZyB0aGlzIG1peGluIHRvIGhhdmUgcmVmZXJlbmNlIHRvIFIuRmx1eCAoUHJvdmlkZXMgYnkgdGhlIFIuUm9vdCk8L3A+XG4gICAgICAqIEBwcm9wZXJ0eSBjb250ZXh0VHlwZXNcbiAgICAgICogQHR5cGUge29iamVjdH0gZmx1eFxuICAgICAgKi9cbiAgICAgIGNvbnRleHRUeXBlczoge1xuICAgICAgICBmbHV4OiBSLkZsdXguUHJvcFR5cGUsXG4gICAgICB9LFxuXG4gICAgICBfQ29tcG9uZW50TWl4aW5IYXNDb21wb25lbnRNaXhpbjogdHJ1ZSxcbiAgICAgIC8qKiA8cD5Qcm92aWRlIEZsdXggZm9yIHRoZSBjdXJyZW50IGNvbXBvbmVudDwvcD5cbiAgICAgICogQG1ldGhvZCBnZXRGbHV4XG4gICAgICAqIEByZXR1cm4ge29iamVjdH0gdGhpcy5jb250ZXh0LmZsdXggVGhlIEZsdXggb2YgdGhlIEFwcFxuICAgICAgKi9cbiAgICAgIGdldEZsdXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuZmx1eDtcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gQ29tcG9uZW50O1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==