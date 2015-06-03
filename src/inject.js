import bind from './bind';

function inject(getNexusBindings, displayName) {
  return (Component) => bind(Component, getNexusBindings, displayName);
}

export default inject;
