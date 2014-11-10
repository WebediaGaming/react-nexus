"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = require("lodash");
  var assert = require("assert");
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
      getFlux: function getFlux() {
        return this.context.flux;
      } } };

  return Component;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkNvbXBvbmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsTUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLE1BQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7Ozs7Ozs7Ozs7QUFVcEIsTUFBSSxTQUFTLEdBQUc7QUFDWixTQUFLLEVBQUU7Ozs7OztBQU1ILFlBQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDOzs7Ozs7O0FBT3BFLGtCQUFZLEVBQUU7QUFDVixZQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQ3hCOztBQUVELHNDQUFnQyxFQUFFLElBQUk7Ozs7O0FBS3RDLGFBQU8sRUFBRSxTQUFTLE9BQU8sR0FBRztBQUN4QixlQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO09BQzVCLElBRVIsQ0FBQzs7QUFFRixTQUFPLFNBQVMsQ0FBQztDQUNwQixDQUFDIiwiZmlsZSI6IlIuQ29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICAgIHZhciBfID0gcmVxdWlyZShcImxvZGFzaFwiKTtcclxuICAgIHZhciBhc3NlcnQgPSByZXF1aXJlKFwiYXNzZXJ0XCIpO1xyXG4gICAgdmFyIFJlYWN0ID0gUi5SZWFjdDtcclxuXHJcbiAgICAvKipcclxuICAgICogPHA+RGVmaW5lcyBhIHNwZWNpZmljIG1peGluPC9wPlxyXG4gICAgKiA8cD5UaGlzIHdpbGwgYWxsb3cgdG8gY29tcG9uZW50cyB0byBhY2Nlc3MgdGhlIG1haW4gbWV0aG9kcyBvZiByZWFjdC1yYWlsczwvcD5cclxuICAgICogPHVsPlxyXG4gICAgKiA8bGk+IENvbXBvbmVudC5nZXRGbHV4ID0+IFByb3ZpZGUgRmx1eCBmb3IgdGhlIGN1cnJlbnQgY29tcG9uZW50IDwvbGk+XHJcbiAgICAqIDwvdWw+XHJcbiAgICAqIEBjbGFzcyBSLkNvbXBvbmVudFxyXG4gICAgKi9cclxuICAgIHZhciBDb21wb25lbnQgPSB7XHJcbiAgICAgICAgTWl4aW46IHtcclxuICAgICAgICAgICAgLyoqICBcclxuICAgICAgICAgICAgKiA8cD5SZWZlcnMgdG8gc3BlY2lmaWNzIG1peGlucyBpbiBvcmRlciB0byBtYW5hZ2UgUHVyZSwgQXN5bmMsIEFuaW1hdGUgYW5kIEZsdXggbWV0aG9kczwvcD5cclxuICAgICAgICAgICAgKiBAcHJvcGVydHkgbWl4aW5zXHJcbiAgICAgICAgICAgICogQHR5cGUge2FycmF5Lm9iamVjdH1cclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbWl4aW5zOiBbUi5QdXJlLk1peGluLCBSLkFzeW5jLk1peGluLCBSLkFuaW1hdGUuTWl4aW4sIFIuRmx1eC5NaXhpbl0sXHJcbiAgICAgICAgICAgIC8qKiBcclxuICAgICAgICAgICAgKiA8cD5EZWZpbmVzIGNvbnRleHQgb2JqZWN0IGZvciB0aGUgY3VycmVudCBjb21wb25lbnQ8YnIgLz5cclxuICAgICAgICAgICAgKiBBbGxvd3MgYWxsIGNvbXBvbmVudHMgdXNpbmcgdGhpcyBtaXhpbiB0byBoYXZlIHJlZmVyZW5jZSB0byBSLkZsdXggKFByb3ZpZGVzIGJ5IHRoZSBSLlJvb3QpPC9wPlxyXG4gICAgICAgICAgICAqIEBwcm9wZXJ0eSBjb250ZXh0VHlwZXNcclxuICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fSBmbHV4XHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNvbnRleHRUeXBlczoge1xyXG4gICAgICAgICAgICAgICAgZmx1eDogUi5GbHV4LlByb3BUeXBlLFxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgX0NvbXBvbmVudE1peGluSGFzQ29tcG9uZW50TWl4aW46IHRydWUsXHJcbiAgICAgICAgICAgIC8qKiA8cD5Qcm92aWRlIEZsdXggZm9yIHRoZSBjdXJyZW50IGNvbXBvbmVudDwvcD5cclxuICAgICAgICAgICAgKiBAbWV0aG9kIGdldEZsdXhcclxuICAgICAgICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IHRoaXMuY29udGV4dC5mbHV4IFRoZSBGbHV4IG9mIHRoZSBBcHBcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZ2V0Rmx1eDogZnVuY3Rpb24gZ2V0Rmx1eCgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuZmx1eDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gQ29tcG9uZW50O1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=