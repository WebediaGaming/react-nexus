module.exports = function(R) {
    var _ = require("lodash");
    var React = R.React;

    var _vanillaReactChildren = React.Children;

    var _patchedReactChildren = _.extend({}, React.Children, {
        getChildrenList: function getChildrenList(component) {
            if(null === component || !component.props || !component.props.children) {
                return [];
            }
            return React.Children.map(component.props.children, _.identity);
        },
        getDescendantsList: function getDescendantsList(component) {
            var childrenList = React.Children.getChildrenList(component);
            var descendantsList = [];
            _.each(childrenList, function(child) {
                descendantsList.push(child);
                var subDescendantsList = React.Children.getDescendantsList(child);
                _.each(subDescendantsList, function(node) {
                    descendantsList.push(node);
                });
            });
            return descendantsList;
        },
        mapDescendants: function mapDescendants(component, fn) {
            return _.map(React.Children.getDescendantsList(component), fn);
        },
        mapTree: function mapTree(component, fn) {
            var tree = React.Children.getDescendantsList(component, fn);
            tree.unshift(component);
            return _.map(tree, fn);
        },
        restoreVanillaChildren: function restoreVanillaChildren() {
            React.Children = _vanillaReactChildren;
        },
        transformDescendants: function transformDescendants(component, fn) {
            var childrenList = React.Children.getDescendantsList(component);
            if(childrenList.length === 0) {
                return component;
            }
            else {
                component.props.children = React.Children.mapDescendants(component, function(childComponent) {
                    return React.Children.transformTree(childComponent, fn);
                });
                return component;
            }
        },
        transformTree: function transformTree(component, fn) {
            component = fn(component);
            return React.Children.transformDescendants(component, fn);
        },
    });

    React.Children = _patchedReactChildren;

    return _patchedReactChildren;
};
