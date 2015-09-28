import pureShouldComponentUpdate from '../utils/pureShouldComponentUpdate';

function pure(Component) {
  if(!Component) {
    return pure;
  }
  return class extends Component {
    shouldComponentUpdate(...args) {
      return pureShouldComponentUpdate.apply(this, args);
    }
  };
}

pure.shouldComponentUpdate = pureShouldComponentUpdate;

export default pure;
