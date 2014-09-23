/**
 * TODO
 */
module.exports = function(R) {
    var Cordova = {
        Plugin: function Plugin(storeName, dispatcherName) {
            return R.App.createPlugin({
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
