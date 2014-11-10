"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = require("lodash");
  var assert = require("assert");
  var React = R.React;

  /**
  * <p>Defines the specific mixin for the root component<br />
  * This will allow components to access the main methods of react-rails</p>
  * <ul>
  * <li> Component.getFlux => Provide Flux for the current component </li>
  * </ul>
  * @class R.Root
  */
  var Root = {
    Mixin: {
      /**  
      * <p>Refers to specifics mixins in order to manage Pure, Async, Animate and Flux methods</p>
      * @property mixins
      * @type {array.object}
      */
      mixins: [R.Pure.Mixin, R.Async.Mixin, R.Animate.Mixin, R.Flux.Mixin],
      _AppMixinHasAppMixin: true,

      /** <p>Checking types</p>
      * @property propTypes
      * @type {object} flux
      */
      propTypes: {
        flux: R.Flux.PropType },

      /** <p> Must be defined in order to use getChildContext </p>
      * @property childContextTypes
      * @type {object} flux 
      */
      childContextTypes: {
        flux: R.Flux.PropType },

      /** <p>Provides all children access to the Flux of the App </p>
      * @method getChildContext
      * @return {object} flux The flux of current component
      */
      getChildContext: function getChildContext() {
        return {
          flux: this.props.flux };
      },

      /** <p>Provide Flux for the current component</p>
      * @method getFlux
      * @return {object} this.context.flux The Flux of the App
      */
      getFlux: function getFlux() {
        return this.props.flux;
      } } };

  return Root;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlJvb3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDekIsTUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLE1BQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixNQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDOzs7Ozs7Ozs7O0FBVXBCLE1BQUksSUFBSSxHQUFHO0FBQ1AsU0FBSyxFQUFFOzs7Ozs7QUFNSCxZQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUNwRSwwQkFBb0IsRUFBRSxJQUFJOzs7Ozs7QUFNMUIsZUFBUyxFQUFFO0FBQ1AsWUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUN4Qjs7Ozs7O0FBTUQsdUJBQWlCLEVBQUU7QUFDZixZQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQ3hCOzs7Ozs7QUFNRCxxQkFBZSxFQUFFLFNBQVMsZUFBZSxHQUFHO0FBQ3hDLGVBQU87QUFDSCxjQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQ3hCLENBQUM7T0FDTDs7Ozs7O0FBTUQsYUFBTyxFQUFFLFNBQVMsT0FBTyxHQUFHO0FBQ3hCLGVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7T0FDMUIsRUFDSixFQUNKLENBQUM7O0FBRUYsU0FBTyxJQUFJLENBQUM7Q0FDZixDQUFDIiwiZmlsZSI6IlIuUm9vdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgICB2YXIgXyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XHJcbiAgICB2YXIgYXNzZXJ0ID0gcmVxdWlyZShcImFzc2VydFwiKTtcclxuICAgIHZhciBSZWFjdCA9IFIuUmVhY3Q7XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIDxwPkRlZmluZXMgdGhlIHNwZWNpZmljIG1peGluIGZvciB0aGUgcm9vdCBjb21wb25lbnQ8YnIgLz5cclxuICAgICogVGhpcyB3aWxsIGFsbG93IGNvbXBvbmVudHMgdG8gYWNjZXNzIHRoZSBtYWluIG1ldGhvZHMgb2YgcmVhY3QtcmFpbHM8L3A+XHJcbiAgICAqIDx1bD5cclxuICAgICogPGxpPiBDb21wb25lbnQuZ2V0Rmx1eCA9PiBQcm92aWRlIEZsdXggZm9yIHRoZSBjdXJyZW50IGNvbXBvbmVudCA8L2xpPlxyXG4gICAgKiA8L3VsPlxyXG4gICAgKiBAY2xhc3MgUi5Sb290XHJcbiAgICAqL1xyXG4gICAgdmFyIFJvb3QgPSB7XHJcbiAgICAgICAgTWl4aW46IHtcclxuICAgICAgICAgICAgLyoqICBcclxuICAgICAgICAgICAgKiA8cD5SZWZlcnMgdG8gc3BlY2lmaWNzIG1peGlucyBpbiBvcmRlciB0byBtYW5hZ2UgUHVyZSwgQXN5bmMsIEFuaW1hdGUgYW5kIEZsdXggbWV0aG9kczwvcD5cclxuICAgICAgICAgICAgKiBAcHJvcGVydHkgbWl4aW5zXHJcbiAgICAgICAgICAgICogQHR5cGUge2FycmF5Lm9iamVjdH1cclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbWl4aW5zOiBbUi5QdXJlLk1peGluLCBSLkFzeW5jLk1peGluLCBSLkFuaW1hdGUuTWl4aW4sIFIuRmx1eC5NaXhpbl0sXHJcbiAgICAgICAgICAgIF9BcHBNaXhpbkhhc0FwcE1peGluOiB0cnVlLFxyXG5cclxuICAgICAgICAgICAgLyoqIDxwPkNoZWNraW5nIHR5cGVzPC9wPlxyXG4gICAgICAgICAgICAqIEBwcm9wZXJ0eSBwcm9wVHlwZXNcclxuICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fSBmbHV4XHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHByb3BUeXBlczoge1xyXG4gICAgICAgICAgICAgICAgZmx1eDogUi5GbHV4LlByb3BUeXBlLFxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLyoqIDxwPiBNdXN0IGJlIGRlZmluZWQgaW4gb3JkZXIgdG8gdXNlIGdldENoaWxkQ29udGV4dCA8L3A+XHJcbiAgICAgICAgICAgICogQHByb3BlcnR5IGNoaWxkQ29udGV4dFR5cGVzXHJcbiAgICAgICAgICAgICogQHR5cGUge29iamVjdH0gZmx1eCBcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgY2hpbGRDb250ZXh0VHlwZXM6IHtcclxuICAgICAgICAgICAgICAgIGZsdXg6IFIuRmx1eC5Qcm9wVHlwZSxcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8qKiA8cD5Qcm92aWRlcyBhbGwgY2hpbGRyZW4gYWNjZXNzIHRvIHRoZSBGbHV4IG9mIHRoZSBBcHAgPC9wPlxyXG4gICAgICAgICAgICAqIEBtZXRob2QgZ2V0Q2hpbGRDb250ZXh0XHJcbiAgICAgICAgICAgICogQHJldHVybiB7b2JqZWN0fSBmbHV4IFRoZSBmbHV4IG9mIGN1cnJlbnQgY29tcG9uZW50XHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGdldENoaWxkQ29udGV4dDogZnVuY3Rpb24gZ2V0Q2hpbGRDb250ZXh0KCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBmbHV4OiB0aGlzLnByb3BzLmZsdXgsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLyoqIDxwPlByb3ZpZGUgRmx1eCBmb3IgdGhlIGN1cnJlbnQgY29tcG9uZW50PC9wPlxyXG4gICAgICAgICAgICAqIEBtZXRob2QgZ2V0Rmx1eFxyXG4gICAgICAgICAgICAqIEByZXR1cm4ge29iamVjdH0gdGhpcy5jb250ZXh0LmZsdXggVGhlIEZsdXggb2YgdGhlIEFwcFxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBnZXRGbHV4OiBmdW5jdGlvbiBnZXRGbHV4KCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZmx1eDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gUm9vdDtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9