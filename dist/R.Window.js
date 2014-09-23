/**
 * TODO
 */
module.exports = function(R) {
    var Window = {
        Plugin: function Plugin(storeName, dispatcherName) {
            return R.App.createPlugin({
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
