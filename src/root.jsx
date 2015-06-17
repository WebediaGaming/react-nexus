import bindRoot from './bindRoot';

function root(createNexus, defaultRender, displayName) {
  return (Component) => bindRoot(Component, createNexus, defaultRender, displayName);
}

export default root;
