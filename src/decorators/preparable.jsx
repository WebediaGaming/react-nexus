const $prepare = Symbol('preparable');

function preparable(prepare) {
  return function $preparable(Component) {
    return class extends Component {
      static [$prepare](props) {
        if(Component[$prepare]) {
          return Promise.all(Component[$prepare](props), prepare(props));
        }
        return prepare(props);
      }
    };
  };
}

preparable.$prepare = $prepare;

export default preparable;
