/**
 * TODO
 */
module.exports = function(R) {
    var Fullscreen = {
        Plugin: function Plugin(storeName, dispatcherName) {
            return R.App.createPlugin({
                installInClient: function installInClient(flux, window) {
                },
                installInServer: function installInServer(flux, req) {
                },
            });
        },
    };

    R.Fullscreen = Fullscreen;

    module.exports = R;
};
