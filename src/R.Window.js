module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");

    var defaultParams = {
        width: 1280,
        height: 720,
        scrollTop: 0,
        scrollLeft: 0,
    };

    var Window = {
        createPlugin: function createPlugin(storeName, dispatcherName, eventEmitterName, params) {
            _.defaults(params, defaultParams);
            return R.App.createPlugin({
                displayName: "Window",
                installInClient: function installInClient(flux, window) {
                    flux.getDispatcher(dispatcherName).addActionListener("/Window/scrollTo", function* scrollTo(params) {
                        R.Debug.dev(function() {
                            assert(_.isObject(params), "R.Window.Plugin.scrollTo.params: expecting Object.");
                            assert(_.has(params, "top") && _.isNumber(params.top), "R.Window.Plugin.scrollTo.params.top: expecting Number.");
                            assert(_.has(params, "left") && _.isNumber(params.left), "R.Window.Plugin.scrollTo.params.left: expecting Number.");
                        });
                        window.scrollTo(params.top, params.left);
                        yield _.defer;
                    });
                    window.addEventListener("scroll", function() {
                        flux.getStore(storeName).set("/Window/scrollTop", window.scrollTop);
                        flux.getStore(storeName).set("/Window/scrollLeft", window.scrollLeft);
                        flux.getEventEmitter(eventEmitterName).emit("/Window/scroll", {
                            scrollTop: window.scrollTop,
                            scrollLeft: window.scrollLeft,
                        });
                    });
                    window.addEventListener("resize", function() {
                        flux.getStore(storeName).set("/Window/height", window.outerHeight);
                        flux.getStore(storeName).set("/Window/width", window.outerWidth);
                        flux.getEventEmitter(eventEmitterName).emit("/Window/resize", {
                            height: window.outerHeight,
                            width: window.outerWidth,
                        });
                    });
                    flux.getStore(storeName).set("/Window/height", window.outerHeight);
                    flux.getStore(storeName).set("/Window/width", window.outerWidth);
                },
                installInServer: function installInServer(flux, req) {
                    _.each(params, function(val, key) {
                        flux.getStore(storeName).set("/Window/" + key, val);
                    });
                },
            });
        },
    };

    return Window;
};
