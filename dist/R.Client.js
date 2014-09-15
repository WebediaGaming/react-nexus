module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");

    var Client = function Client(appParams) {
        R.Debug.dev(function() {
            assert(R.isClient(), "R.Client(...): should only be called in the client.");
        });
        this._app = new R.App(appParams);
    };

    _.extend(Client.prototype, /** @lends R.Client.prototype */ {
        _app: null,
        _rendered: false,
        mount: function mount() {
            assert(!this._rendered, "R.Client.render(...): should only call mount() once.");
            this._app.renderIntoDocumentInClient(window);
        },
    });

    R.Client = Client;
    return R;
};
