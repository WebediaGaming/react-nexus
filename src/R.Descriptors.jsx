var _ = require("lodash");

function Descriptor(component) {
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
    _isReactRailsDescriptor_: true,
    isNull: false,
    isText: false,
    text: null,
    displayName: null,
    componentClass: null,
    props: null,
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
    clone: function clone() {
        return new Descriptor(this);
    },
    props: function props(newProps) {
        _.extend(this.props, newProps);
        return this;
    },
    children: function children() {
        if(this.props.children) {
            return this.props.children;
        }
        else {
            return [];
        }
    },
    classNames: function classNames() {
        if(!_.has(this.props, "className")) {
            return [];
        }
        else {
            return this.props.className.split(" ");
        }
    },
    hasClassName: function hasClassName(className) {
        return _.contains(this.classNames(), className);
    },
    addClassName: function addClassName(className) {
        var cx = this.classNames();
        cx.push(className);
        this.props.className = cx.join(" ");
    },
    removeClassName: function removeClassName(className) {
        var cx = _.without(this.classNames(), className);
        if(cx.length === 0) {
            delete this.props.className;
        }
        else {
            this.props.className = cx.join(" ");
        }
    },
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
    },
    _findAll: _findAll(acc, predicate) {
        if(predicate(this)) {
            acc.push(this);
        }
        _.each(this.children(), function(child) {
            child._findAll(acc, predicate);
        });
    },
    findAll: function findAll(predicate) {
        return this._findAll([], predicate);
    },
    findOne: function _findOne(predicate) {
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
