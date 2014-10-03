var _ = require("lodash");

var R = {};

// Top level depencies/monkey patches
window.React = R.React = require("react");
R.instantiateReactComponent = require("react/lib/instantiateReactComponent");
_.extend(R, require("./R.utils")(R));
R.Debug             = require("./R.Debug")(R);
R.Lock              = require("./R.Lock")(R);
R.ReactChildren     = require("./R.ReactChildren")(R);
R.ReactCreateClass  = require("./R.ReactCreateClass")(R);

// Core
R.Animate           = require("./R.Animate")(R);
R.App               = require("./R.App")(R);
R.Async             = require("./R.Async")(R);
R.Dispatcher        = require("./R.Dispatcher")(R);
R.EventEmitter      = require("./R.EventEmitter")(R);
R.Flux              = require("./R.Flux")(R);
R.Pure              = require("./R.Pure")(R);
R.$                 = require("./R.$")(R);
R.Router            = require("./R.Router")(R);
R.Store             = require("./R.Store")(R);
R.Style             = require("./R.Style")(R);
R.Stylesheet        = require("./R.Stylesheet")(R);
R.Uplink            = require("./R.Uplink")(R);

// Plugins
R.Cordova           = require("./R.Cordova")(R);
R.Fullscreen        = require("./R.Fullscreen")(R);
R.History           = require("./R.History")(R);
R.Localize          = require("./R.Localize")(R);
R.Window            = require("./R.Window")(R);
R.XWindow           = require("./R.XWindow")(R);

// Core mixins
R.Root              = require("./R.Root")(R);
R.Component         = require("./R.Component")(R);

// Core wrapper
R.Client            = require("./R.Client")(R);

R.Debug.setMode(process.env.NODE_ENV || "development");

module.exports = R;
