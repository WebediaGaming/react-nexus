module.exports = function(R) {
  const _ = R._;
  const React = R.React;

  const _vanillaReactChildren = React.Children;

  const _patchedReactChildren = _.extend({}, React.Children, {
    getChildrenList(component) {
      if(null === component || !component.props || !component.props.children) {
        return [];
      }
      return React.Children.map(component.props.children, (child) => child);
    },

    getDescendantsList(component) {
      const children = React.Children.getChildrenList(component);
      const descendants = [];
      children.forEach((child) => {
        descendants.push(child);
        React.Children.getDescendantsList(child).forEach((childDescendant) => descendants.push(childDescendant));
      });
      return descendants;
    },

    mapDescendants(component, fn) {
      return React.Children.getDescendantsList(component).map(fn);
    },

    mapTree(component, fn) {
      const tree = React.Children.getDescendantsList(component, fn);
      tree.unshift(component);
      return tree.map(fn);
    },

    restoreChildren() {
      React.Children = _vanillaReactChildren;
      return _vanillaReactChildren;
    },

    patchChildren() {
      React.Children = _patchedReactChildren;
      return _patchedReactChildren;
    },

    transformDescendants(component, fn) {
      const children = React.Children.getDescendantsList(component);
      if(children.length === 0) {
        return component;
      }
      if(component.props) {
        const transformChild = (child) => React.Children.transformTree(child, fn);
        component.props.children = React.Children.mapDescendants(component, transformChild);
      }
      return component;
    },

    transformTree(component, fn) {
      return React.Children.transformDescendants(fn(component), fn);
    },

  });

  return _patchedReactChildren.patchChildren();
};
