var _ = require("lodash");
var R = {
    install: function install(params) {
        R.React = params.React;
        R.instantiateReactComponent = params.instantiateReactComponent;

        var install = function install(inject) { inject(R); };
        _.each([require("./R.utils"), require("./R.Debug")], install);
        R.Debug.setMode(params.mode);

        _.each([
            require("./R.utils"),
            require("./R.Debug"),
            require("./R.ReactChildren"),
            require("./R.ReactCreateClass"),

            require("./R.Animate"),
            require("./R.App"),
            require("./R.Async"),
            require("./R.Dispatcher"),
            require("./R.EventEmitter"),
            require("./R.Flux"),
            require("./R.Localize"),
            require("./R.Pure"),
            require("./R.Query"),
            require("./R.Router"),
            require("./R.Store"),
            require("./R.Style"),
            require("./R.Stylesheet"),
            require("./R.Uplink"),

            require("./R.Root"),
            require("./R.Component"),

            require("./R.Client"),
        ], install);

        return R;
    },
};


module.exports = R;
