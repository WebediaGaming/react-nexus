import bindComponent from './bindComponent';

function component(getNexusBindings, displayName) {
  return (Component) => bindComponent(Component, getNexusBindings, displayName);
}

export default component;
