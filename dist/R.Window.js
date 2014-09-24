/**
 * TODO
 */
module.exports = function(R) {
    var Window = {
        createPlugin: function createPlugin(storeName, dispatcherName) {
            return R.App.createPlugin({
                displayName: "Window",
                installInClient: function installInClient(flux, window) {
                },
                installInServer: function installInServer(flux, req) {
                },
            });
        },
    };

    R.Window = Window;

    module.exports = R;
};
