var _ = require("lodash");
var R = {
    mixin: function _mixin(properties) {
        _.extend(this, properties);
        return this;
    },
};

R.mixin(require("./src/R.utils"));
R.mixin(require("./src/R.Debug"));
R.mixin(require("./src/R.Decorate"));
R.mixin(require("./src/R.Descriptor"));
R.mixin(require("./src/R.createAppClass"));
R.mixin(require("./src/R.createComponentClass"));
R.mixin(require("./src/R.Dependencies"));
R.mixin(require("./src/R.Router"));
R.mixin(require("./src/R.Dispatcher"));
R.mixin(require("./src/R.EventEmitter"));
R.mixin(require("./src/R.Store"));
R.mixin(require("./src/R.Animate"));
R.mixin(require("./src/R.Async"));
R.mixin(require("./src/R.Query"));
R.mixin(require("./src/R.Pure"));

module.exports = R;
