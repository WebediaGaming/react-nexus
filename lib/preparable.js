import isReactComponent from './util/isReactComponent';
const $prepare = Symbol('preparable');

/**
 * Decorate a React.Component to make it preparable by the prepare() function.
 * @param {Function} prepare Async function which takes props and returns a Promise for when the component is ready
 *                           to be rendered.
 * @return {Function} A function which takes a React.Component and returns a preparable version
 */
function preparable(prepare) {
  if(typeof prepare !== 'function') {
    throw new TypeError('@preparable() should be passed an async function');
  }
  return function extendComponent(Component) {
    if(!isReactComponent(Component)) {
      throw new TypeError('@preparable should only be applied to React Components');
    }
    return class extends Component {
      static async [$prepare](props, context) {
        if(Component[$prepare]) {
          await Component[$prepare](props, context);
        }
        return await prepare(props, context);
      }
    };
  };
}

Object.assign(preparable, { $prepare });

export default preparable;
