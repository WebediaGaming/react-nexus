module.exports = function(R) {
    var co = require("co");
    var _ = require("lodash");
    var assert = require("assert");
    var url = require("url");

    var RenderServer = function RenderServer(App) {
        R.Debug.dev(function() {
            assert(R.isServer(), "R.RenderServer(...): should only be called in the server.");
        });
        this._app = new App();
        this.middleware = R.scope(this.middleware, this);
    };

    _.extend(RenderServer.prototype, /** @lends R.RenderServer.Prototype */ {
        _app: null,
        middleware: function middleware(req, res) {
            co(function*() {
                return yield this._app.renderToStringInServer(req);
            }).call(this, function(err, val) {
                if(err) {
                    if(R.Debug.isDev()) {
                        return res.status(500).json({ err: err.toString(), stack: err.stack });
                    }
                    else {
                        return res.status(500).json({ err: err.toString() });
                    }
                }
                else {
                    res.status(200).send(val);
                }
            });
        },
    });

    R.RenderServer = RenderServer;
    return R;
};
