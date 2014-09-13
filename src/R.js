var _ = require("lodash");
var R = {
    mixin: function _mixin(properties) {
        _.extend(this, properties);
        return this;
    },
};

R.mixin({
    d3: require("../lib/d3"),
});

R.mixin(require("./R.utils"));
R.mixin(require("./R.Debug"));
R.mixin(require("./R.Decorate"));
R.mixin(require("./R.Descriptor"));
R.mixin(require("./R.App"));
R.mixin(require("./R.Component"));
R.mixin(require("./R.Dependencies"));
R.mixin(require("./R.Router"));
R.mixin(require("./R.Session"));
R.mixin(require("./R.Users"));
R.mixin(require("./R.Dispatcher"));
R.mixin(require("./R.EventEmitter"));
R.mixin(require("./R.Flux"));
R.mixin(require("./R.Store"));
R.mixin(require("./R.Animate"));
R.mixin(require("./R.Async"));
R.mixin(require("./R.Query"));
R.mixin(require("./R.Pure"));

module.exports = R;
