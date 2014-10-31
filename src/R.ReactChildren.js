module.exports = function(R) {
    var _ = require("lodash");
    var React = R.React;

    var _vanillaReactChildren = React.Children;
    /**
    * <p>Method definitions that complements React.Children. <br />
    * Used to navigate through all children of a specific component in order to calculate its descendants. </p>
    * @class R.ReactChildren
    */
    var _patchedReactChildren = _.extend({}, React.Children, {
        /**
        * <p>Returns the child of the specified component </p>
        * @method getChildrenList
        * @param {object} component The current component 
        * @return {object} object The child of the specified component
        */
        getChildrenList: function getChildrenList(component) {
            if(null === component || !component.props || !component.props.children) {
                return [];
            }
            return React.Children.map(component.props.children, _.identity);
        },
        /**
        * <p>Returns all children of the specified component </p>
        * @method getDescendantsList
        * @param {object} component The current component 
        * @return {object} descendantsList The list of children of the specified component
        */
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
        /**
        * <p>Returns all children of the specified component and execute the specified function </p>
        * @method mapDescendants
        * @param {object} component The current component 
        * @param {Function} fn The function to execute 
        * @return {object} object The list of children of the specified component
        */
        mapDescendants: function mapDescendants(component, fn) {
            return _.map(React.Children.getDescendantsList(component), fn);
        },
       /**
        * <p>Compute all children of the specified component and execute the function </p>
        * @method mapTree
        * @param {object} component The current component 
        * @param {Function} fn The function to execute
        * @return {object} object The list of children without the component and call fn for each of them
        */
        mapTree: function mapTree(component, fn) {
            var tree = React.Children.getDescendantsList(component, fn);
            tree.unshift(component);
            return _.map(tree, fn);
        },
        /**
        * <p> Function to use if you want restore native function of React.Children </p>
        * @method restoreVanillaChildren
        */
        restoreVanillaChildren: function restoreVanillaChildren() {
            React.Children = _vanillaReactChildren;
        },
        /**
        * <p> Function to use if you want convert all the descendants of the component using a specified function </p>  
        * @method transformDescendants
        * @param {object} component The current component 
        * @param {Function} fn The function to execute
        * @return {object} component The computed component
        */
        transformDescendants: function transformDescendants(component, fn) {
            var childrenList = React.Children.getDescendantsList(component);
            if(childrenList.length === 0) {
                return component;
            }
            else {
                if(component.props){
                    component.props.children = React.Children.mapDescendants(component, function(childComponent) {
                        return React.Children.transformTree(childComponent, fn);
                    });
                }
                return component;
            }
        },
        /**
        * <p> Convert all the current descendant of the component using a specified function </p>  
        * @method transformTree
        * @param {object} component The current component 
        * @param {Function} fn The function to execute
        * @return {object} object Call the transformDescendants function in order to convert the subdescendant of the current component
        */
        transformTree: function transformTree(component, fn) {
            component = fn(component);
            return React.Children.transformDescendants(component, fn);
        },
    });

    React.Children = _patchedReactChildren;

    return _patchedReactChildren;
};
