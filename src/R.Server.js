module.exports = function(R) {
    var co = require("co");
    var _ = require("lodash");
    var assert = require("assert");

    var Server = function Server(appParams) {
        R.Debug.dev(function() {
            assert(R.isServer(), "R.Server(...): should only be called in the server.");
        });
        this._app = new R.App(appParams);
        this.middleware = R.scope(this.middleware, this);
    };

    _.extend(Server.prototype, /** @lends R.Server.Prototype */ {
        _app: null,
        middleware: function middleware(req, res) {
            co(function*() {
                return yield this._app.renderToStringInServer(req);
            }).call(this, function(err, val) {
                if(err) {
                    return res.status(500).json({ err: err.toString() });
                }
                else {
                    res.status(200).send(val);
                }
            });
        },
    });

    R.Server = Server;
    return R;
};
