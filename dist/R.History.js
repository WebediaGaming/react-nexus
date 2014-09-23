module.exports = function(R) {
    var History = {
        Plugin: function Plugin(storeName, dispatcherName) {
            return R.App.createPlugin({
                installInClient: function installInClient(flux, window) {
                    flux.getDispatcher(dispatcherName).addActionListener("/History/navigate", regeneratorRuntime.mark(function navigate(pathname) {
                        var href;

                        return regeneratorRuntime.wrap(function navigate$(context$4$0) {
                            while (1) switch (context$4$0.prev = context$4$0.next) {
                            case 0:
                                context$4$0.next = 2;
                                return _.defer;
                            case 2:
                                href = url.parse(window.location.href);
                                href.pathname = pathname;
                                window.pushState(null, null, url.format(_.extend(url.parse(window.location.href), { pathname: pathname })));
                            case 5:
                            case "end":
                                return context$4$0.stop();
                            }
                        }, navigate, this);
                    }));
                    window.addEventListener("popstate", function(e) {
                        flux.getFluxStore(storeName).set("/History/pathname", url.parse(window.location.href).pathname);
                    });
                },
                installInServer: function installInServer(flux, req) {
                    flux.getFluxStore(storeName).set("/History/pathname", url.parse(req.url).pathname);
                },
            });
        },
    };

    R.History = History;

    module.exports = R;
};
