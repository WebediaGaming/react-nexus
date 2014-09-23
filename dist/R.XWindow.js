/**
 * TODO
 */
module.exports = function(R) {
    var XWindow = {
        Plugin: function Plugin(storeName, dispatcherName) {
            return R.App.createPlugin({
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
