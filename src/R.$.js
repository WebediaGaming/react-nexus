module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");

    var $ = function $(component) {
        this._subject = component;
    };

    _.extend($.prototype, {
        _subject: null,
        get: function get() {
            return this._subject;
        },
        type: function type(optType) {
            if(optType) {
                this._subject = optType(this._subject.props);
                return this;
            }
            else {
                return this._subject.type;
            }
        },
        prop: function prop(key, optVal) {
            if(optVal) {
                this._subject = this._subject.type(this._subject.props);
                this._subject.props[key] = optVal;
                return this;
            }
            else {
                return this._subject.props[key];
            }
        },
        props: function props(arg) {
            if(_.isArray(arg)) {
                return _.object(_.map(arg, R.scope(function(key) {
                    return [key, this._subject.props[key]];
                }, this)));
            }
            else {
                this._subject = this._subject.type(this._subject.props);
                _.each(arg, R.scope(function(val, key) {
                    this._subject.props[key] = val;
                }));
                return this;
            }
        },
        classNameList: function classNameList(optVal) {
            if(optVal) {
                return this.prop("className", optVal.join(" "));
            }
            else {
                return (this.prop("className") || "").split(" ");
            }
        },
        addClassName: function addClassName(className) {
            var cx = this.classNameList();
            cx.push(className);
            return this.prop("className", _.uniq(cx));
        },
        removeClassName: function removeClassName(className) {
            var cx = this.classNameList();
            cx = _.without(cx, className);
            return this.prop("className", cx);
        },
        hasClassName: function hasClassName(className) {
            var cx = this.classNameList();
            return _.contains(cx, className);
        },
        toggleClassName: function toggleClassName(className, optVal) {
            if(!_.isUndefined(optVal)) {
                if(optVal) {
                    return this.addClassName(className);
                }
                else {
                    return this.removeClassName(className);
                }
            }
            else {
                return this.toggleClassName(className, !this.hasClassName(className));
            }
        },
        append: function append(component) {
            var children = ReactChildren.getChildrenList(this._subject);
            children.push(component);
            return this.prop("children", children);
        },
        prepend: function prepend(component) {
            var children = ReactChildren.getChildrenList(this._subject);
            children.unshift(component);
            return this.prop("children", children);
        },
        transformTree: function transformTree(fn) {
            this._subject = ReactChildren.transformTree(this._subject, fn);
            return this;
        },
        tap: function tap(fn) {
            fn(this._subject);
            return this;
        },
        walkTree: function walkTree(fn) {
            var tree = ReactChildren.mapTree(this._subject, _.identity);
            _.each(tree, fn);
            return this;
        },
        end: function end() {
            var _subject = this._subject;
            this._subject = null;
            return _subject;
        },
    });

    return $;
};
