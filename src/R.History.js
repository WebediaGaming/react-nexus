module.exports = function(R) {
    var History = {
        Plugin: function Plugin(storeName, dispatcherName) {
            return R.App.createPlugin({
                installInClient: function installInClient(flux, window) {
                    flux.getDispatcher(dispatcherName).addActionListener("/History/navigate", function* navigate(pathname) {
                        yield _.defer;
                        var href = url.parse(window.location.href);
                        href.pathname = pathname;
                        window.pushState(null, null, url.format(_.extend(url.parse(window.location.href), { pathname: pathname })));
                    });
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
