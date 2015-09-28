import pureShouldComponentUpdate from '../utils/pureShouldComponentUpdate';

function pure() {
  return (Component) => class extends Component {
    shouldComponentUpdate(...args) {
      return pureShouldComponentUpdate.apply(this, args);
    }
  };
}

pure.shouldComponentUpdate = pureShouldComponentUpdate;

export default pure;
