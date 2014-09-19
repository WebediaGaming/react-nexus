module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");
    var React = R.React;

    var Client = function Client(appParams) {
        R.Debug.dev(function() {
            assert(R.isClient(), "R.Client(...): should only be called in the client.");
            if(window.React) {
                console.warn("Warning: React is already attached to window.");
            }
        });
        window.React = React;
        R.Debug.dev(R.scope(function() {
            if(!window.__ReactOnRails) {
                window.__ReactOnRails = {};
            }
            if(!window.__ReactOnRails.apps) {
                window.__ReactOnRails.apps = [];
            }
            window.__ReactOnRails.apps.push(this);
        }, this));
        this._app = new R.App(appParams);
    };

    _.extend(Client.prototype, /** @lends R.Client.prototype */ {
        _app: null,
        _rendered: false,
        mount: function* mount() {
            assert(!this._rendered, "R.Client.render(...): should only call mount() once.");
            yield this._app.renderIntoDocumentInClient(window);
        },
    });

    R.Client = Client;
    return R;
};
