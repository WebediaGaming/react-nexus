import pureShouldComponentUpdate from './pureShouldComponentUpdate';
export default function pure() {
  return (Component) => class extends Component {
    shouldComponentUpdate(...args) {
      return pureShouldComponentUpdate.apply(this, args);
    }
  };
}
