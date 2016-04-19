import decorateAction from './actions';
import decorateStores from './stores';

/**
 * Enhance a React Component and make context's {@link Flux}'s {@link Actions}s and {@link Stores} requested by bindings
 * avaliable as props.
 * @param {Function} getDeps Function taking component props and returning an object containing
 * Action and Store bindings for the component.
 * @param {Object} options Options object to provide for stores and actions.
 * @return {Component} Enhanced component.
 * @example
 * ...
 * @deps((props) => ({
 *   actions: {
 *     ...
 *   },
 *   stores: {
 *     ...
 *   },
 * }), {
 *   actions: {
 *    ...
 *   },
 *   stores: {
 *    ...
 *   },
 * })
 * class Foo extends Component {
 * ...
 */
export default function deps(getDeps, options = {}) {
  return (Component) =>
    decorateAction((props) => getDeps(props).actions, options.actions)(
      decorateStores((props) => getDeps(props).stores, options.stores)(
        Component,
      ),
    )
  ;
}
