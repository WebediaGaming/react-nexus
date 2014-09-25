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
            co(regeneratorRuntime.mark(function callee$2$0() {
                return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        context$3$0.next = 2;
                        return this._app.renderToStringInServer(req);
                    case 2:
                        return context$3$0.abrupt("return", context$3$0.sent);
                    case 3:
                    case "end":
                        return context$3$0.stop();
                    }
                }, callee$2$0, this);
            })).call(this, function(err, val) {
                if(err) {
                    if(R.Debug.isDev()) {
                        return res.status(500).json({ err: err.toString(), stack: err.stack });
                    }
                    else {
                        return res.status(500).json({ err: err.toString(), stack: err.stack });
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
