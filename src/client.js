var R = {
    install: function install(React, instantiateReactComponent) {
        R.React = React;
        R.instantiateReactComponent = instantiateReactComponent;
        [
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
        ].forEach(function(inject) {
            inject(R);
        });
        return R;
    },
};


module.exports = R;
