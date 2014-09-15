var R = require("./R");
var co = require("co");
var _ = require("lodash");
var assert = require("assert");

var Server = function Server(appParams) {
    R.Debug.dev(function() {
        assert(R.isServer(), "R.Server(...): should only be called in the server.");
    });
    this._app = new R.App(appParams);
};

_.extend(Server.prototype, /** @lends R.Server.Prototype */ {
    _app: null,
    middleware: function middleware(req, res, next) {
        co(regeneratorRuntime.mark(function callee$1$0() {
            var html;

            return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return this._app.renderToStringInServer(req);
                case 2:
                    html = context$2$0.sent;
                    res.status(200).send(html);
                case 4:
                case "end":
                    return context$2$0.stop();
                }
            }, callee$1$0, this);
        }))(this);
    },
});

module.exports = {
    Server: Server,
};
