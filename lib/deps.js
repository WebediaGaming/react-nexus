import decorateAction from './actions';
import decorateStores from './stores';

export default function deps(getDeps) {
  return (Component) =>
    decorateAction((props) => getDeps(props).actions)(
      decorateStores((props) => getDeps(props).stores)(
        Component,
      ),
    )
  ;
}
