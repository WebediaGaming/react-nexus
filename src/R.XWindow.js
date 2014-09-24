/**
 * TODO
 */
module.exports = function(R) {
    var XWindow = {
        createPlugin: function createPlugin(storeName, dispatcherName) {
            return R.App.createPlugin({
                displayName: "XWindow",
                installInClient: function installInClient(flux, window) {
                },
                installInServer: function installInServer(flux, req) {
                },
            });
        },
    };

    R.XWindow = XWindow;

    module.exports = R;
};
