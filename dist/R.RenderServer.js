module.exports = function(R) {
    var co = require("co");
    var _ = require("lodash");
    var assert = require("assert");
    var url = require("url");

    /**
    * <p>Simply provides an specified App for the RenderServer</p>
    * <p>Provides instance of App </p>
    * <ul>
    * <li> RenderServer.middleware => compute all React Components with data and render the corresponding HTML for the requesting client </li>
    * </ul>
    * @class R.RenderServer
    */
    var RenderServer = function RenderServer(App) {
        R.Debug.dev(function() {
            assert(R.isServer(), "R.RenderServer(...): should only be called in the server.");
        });
        this._app = new App();
        this.middleware = R.scope(this.middleware, this);
    };

    _.extend(RenderServer.prototype, /** @lends R.RenderServer.Prototype */ {
        _app: null,
        /**
        * <p> Call the renderToStringInServer from R.App function </p>
        * @method middleware
        */
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
                        return res.status(500).json({ err: err.toString() });
                    }
                }
                else {
                    res.status(200).send(val);
                }
            });
        },
    });

    return RenderServer;
};
