const $preparable = Symbol('preparable');

/**
 * Extends/decorate a React.Component to make it preparable by the prepare() function.
 * @param {Function} prepare Async function which takes props and returns a Promise for when the component is ready
 *                           to be rendered.
 * @returns {Function} A function which takes a React.Component and returns a preparable version
 */
function preparable(prepare) {
  return function extendComponent(Component) {
    return class extends Component {
      static [$preparable](props, context) {
        if(Component[$preparable]) {
          return Promise.all([Component[$preparable](props, context), prepare(props, context)]);
        }
        return prepare(props, context);
      }
    };
  };
}

Object.assign(preparable, { $preparable });

export default preparable;
