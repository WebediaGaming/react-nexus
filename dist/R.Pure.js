module.exports = function(R) {
    var _ = require("lodash");

    var shouldComponentUpdate = function shouldComponentUpdate(props, state) {
        return !(_.isEqual(this.props, props) && _.isEqual(this.state, state));
    };

    /**
     * @memberof R
     * @type {Object}
     * @public
     */
    var Pure = /** @lends Pure */{
        /**
         * Implements React shouldComponentUpdate for pure components,
         * ie. update iff props or state has changed.
         * @type {Function}
         * @public
         */
        shouldComponentUpdate: shouldComponentUpdate,
        /**
         * Mixin for Pure components implementing the pure shouldComponentUpdate.
         * @type {Object}
         * @public
         */
        Mixin: {
            _PureMixinIsPure: true,
            shouldComponentUpdate: shouldComponentUpdate,
        },
    };

    R.Pure = Pure;
    return R;
};
