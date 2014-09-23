/**
 * TODO
 */
module.exports = function(R) {
    var Cordova = {
        createPlugin: function createPlugin(storeName, dispatcherName) {
            return R.App.createPlugin({
                displayName: "Cordova",
                installInClient: function installInClient(flux, window) {
                },
                installInServer: function installInServer(flux, req) {
                },
            });
        },
    };

    R.Cordova = Cordova;

    module.exports = R;
};
