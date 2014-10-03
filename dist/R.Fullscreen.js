/**
 * TODO
 */
module.exports = function(R) {
    var Fullscreen = {
        createPlugin: function createPlugin(storeName, dispatcherName) {
            return R.App.createPlugin({
                displayName: "Fullscreen",
                installInClient: function installInClient(flux, window) {
                },
                installInServer: function installInServer(flux, req) {
                },
            });
        },
    };

    return Fullscreen;
};
