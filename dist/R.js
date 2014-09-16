var R = {};
[
    require("./R.utils"),
    require("./R.patchReact"),
    require("./R.Animate"),
    require("./R.App"),
    require("./R.Async"),
    require("./R.Component"),
    require("./R.Debug"),
    require("./R.Decorate"),
    require("./R.Descriptor"),
    require("./R.Dispatcher"),
    require("./R.EventEmitter"),
    require("./R.Flux"),
    require("./R.Localize"),
    require("./R.Pure"),
    require("./R.Query"),
    require("./R.Root"),
    require("./R.Router"),
    require("./R.SimpleUplinkServer"),
    require("./R.Store"),
    require("./R.Style"),
    require("./R.Stylesheet"),
    require("./R.Uplink"),
].forEach(function(inject) {
    inject(R);
});

module.exports = R;
