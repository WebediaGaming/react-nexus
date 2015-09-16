import bindComponent from './bindComponent';

function component(getNexusBindings, shouldNexusComponentUpdate, displayName) {
  return (Component) => bindComponent(Component, getNexusBindings, shouldNexusComponentUpdate, displayName);
}

export default component;
