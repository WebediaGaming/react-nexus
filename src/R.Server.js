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
        co(function*() {
            var html = yield this._app.renderToStringInServer(req);
            res.status(200).send(html);
        })(this);
    },
});

module.exports = {
    Server: Server,
};
