var _ = require("lodash");

/**
 * @memberOf R
 * @public
 * @class Lightweight description of a component, POJO-style. Convertible from and into a JSX-like descriptor.
 * @param {React.Component} component The React Component to describe.
 */
var Descriptor = function Descriptor(component) {
    if(component._isReactRailsDescriptor_) {
        _.extend(this, {
            isNull: component.isNull,
            isText: component.isText,
            text: component.text,
            displayName: component.displayName,
            componentClass: component.componentClass,
            props: _.clone(component.props),
        });
    }
    else if(component === null) {
        this.isNull = true;
    }
    else if(_.isString(component)) {
        this.isText = true;
        this.text = component;
    }
    else {
        this.displayName = component.type.displayName;
        this.componentClass = component.constructor;
        if(!component.props) {
            this.props = {};
        }
        else {
            this.props = _.clone(component.props);
        }
    }
    if(this.props.children) {
        this.props.children = _.map(this.props.children, function(component) {
            return new Descriptor(component);
        });
    }
};

_.extend(Descriptor.prototype, {
    /**
     * Type dirty-checking shortcut.
     * @type {Boolean}
     * @private
     */
    _isReactRailsDescriptor_: true,
    /**
     * Is this component a null component ?
     * @type {Boolean}
     * @public
     * @readOnly
     */
    isNull: false,
    /**
     * Is this component a text component ?
     * @type {Boolean}
     * @public
     * @readOnly
     */
    isText: false,
    /**
     * Text contents of the component, in case it is a text component.
     * Null otherwise.
     * @type {String?}
     * @public
     * @readOnly
     */
    text: null,
    /**
     * Original displayName.
     * @type {String?}
     * @public
     * @readOnly
     */
    displayName: null,
    /**
     * Original class constructor.
     * @type {Function?}
     * @public
     * @readOnly
     */
    componentClass: null,
    /**
     * Props of the component.
     * @type {Object.<String, *>}
     * @public
     * @readOnly
     */
    props: null,
    /**
     * Returns a React Component matching the descriptor.
     * @return {React.Component}
     * @public
     */
    toComponent: function toComponent() {
        if(this.isNull) {
            return null;
        }
        if(this.isText) {
            return this.text;
        }
        var props = _.clone(this.props);
        if(props.children) {
            props.children = _.map(props.children, function(descriptor) {
                return descriptor.toComponent();
            });
        }
        return new this.componentClass(props);
    },
    /**
     * Creates a new Descriptor with the same characteristics.
     * @return {R.Descriptor}
     * @public
     */
    clone: function clone() {
        return new Descriptor(this);
    },
    /**
     * Mutates the props by extension.
     * @chainable
     * @public
     */
    setProps: function setProps(newProps) {
        _.extend(this.props, newProps);
        return this;
    },
    /**
     * Returns the (maybe empty) list of children.
     * @return {Array.<R.Descriptor>}
     * @public
     */
    children: function children() {
        if(this.props.children) {
            return this.props.children;
        }
        else {
            return [];
        }
    },
    /**
     * Returns the (maybe empty) list of classNames.
     * @return {Array.<String>}
     * @public
     */
    classNames: function classNames() {
        if(!_.has(this.props, "className")) {
            return [];
        }
        else {
            return this.props.className.split(" ");
        }
    },
    /**
     * Checks whether the descriptor has the given className in its classNames list.
     * @param {String} className The className to test.
     * @return {Boolean}
     * @public
     */
    hasClassName: function hasClassName(className) {
        return _.contains(this.classNames(), className);
    },
    /**
     * Muates the descriptor to add the given className to its classNames list.
     * @param {String} className The className to add.
     * @chainable
     * @public
     */
    addClassName: function addClassName(className) {
        if(this.hasClassName(className)) {
            return this;
        }
        var cx = this.classNames();
        cx.push(className);
        this.props.className = cx.join(" ");
        return this;
    },
    /**
     * Muates the descriptor to add the given className to its classNames list.
     * @param {String} className The className to remove.
     * @chainable
     * @public
     */
    removeClassName: function removeClassName(className) {
        if(!this.hasClassName(className)) {
            return this;
        }
        var cx = _.without(this.classNames(), className);
        if(cx.length === 0) {
            delete this.props.className;
        }
        else {
            this.props.className = cx.join(" ");
        }
        return this;
    },
    /**
     * Muates the descriptor to toggle the given className in its classNames list (add it if not present, remove it if already present).
     * In case optState is given, then the className will be present iff optState is truthy, regardless of whether if was there before.
     * @chainable
     * @public
     */
    toggleClassName: function toggleClassName(className, optState) {
        if(!_.isUndefined(optState)) {
            if(optState) {
                this.addClassName(className);
            }
            else {
                this.removeClassName(className);
            }
        }
        else {
            if(this.hasClassName(className)) {
                this.removeClassName(className);
            }
            else {
                this.addClassName(className);
            }
        }
        return this;
    },
    /**
     * @param {Array.<R.Descriptor>} acc Accumulator
     * @param {Function(R.Descriptor): Boolean} predicate Predicate
     * @return {Array.<R.Descriptor>}
     * @private
     */
    _findAll: function _findAll(acc, predicate) {
        if(predicate(this)) {
            acc.push(this);
        }
        _.each(this.children(), function(child) {
            child._findAll(acc, predicate);
        });
        return acc;
    },
    /**
     * Find all the descriptors in the components hierarchy that match a predicate.
     * @param {Function(R.Descriptor): Boolean} predicate
     * @return {Array.<R.Descriptor>}
     * @public
     */
    findAll: function findAll(predicate) {
        return this._findAll([], predicate);
    },
    /**
     * Find the first descriptor in the components hierarchy (LTR DFS) that match a predicate, or null if no
     * such component is found.
     * @param {Function(R.Descriptor): Boolean} predicate The predicate to match.
     * @return {Array.<R.Descriptor>?}
     * @public
     */
    findOne: function findOne(predicate) {
        if(predicate(this)) {
            return this;
        }
        var found = null;
        _.each(this.children(), function(child) {
            if(found) {
                return;
            }
            found = child._findOne(predicate);
        });
        return found;
    },
});

module.exports = {
    Descriptor: Descriptor,
};
