module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");

    var $ = function $(x) {
        if(_.isString(x)) {
            this._descriptors = [R.Descriptor.parseHtml(x)];
        }
        else if(_.isArray(x)) {
            this._descriptors = x;
        }
        else {
            this._descriptors = [new R.Descriptor(x)];
        }
    };

    _.extend($, /** @lends R.$ */{
        Mixin: {
            $: null,
            _$MixinHas$Mixin: true,
            componentWillMount: function componentWillMount() {
                this.$ = new $(this);
            },
            componentWillReceiveProps: function componentWillReceiveProps() {
                this.$ = new $(this);
            },
            componentWillUnmount: function componentWillUnmount() {
                this.$ = null;
            },
        },
    });

    _.extend($.prototype, /** @lends R.$.prototype */ {
        _descriptors: null,
        each: function each(fn) {
            _.each(this._descriptors, fn);
        },
        map: function map(fn) {
            return _.map(this._descriptors, fn);
        },
        transform: function transform(fn) {
            return new $(this.map(fn));
        },
        find: null,
        replace: null,
    });

    R.$ = $;
    return R;
};
