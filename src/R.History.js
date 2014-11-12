module.exports = function(R) {
  const _ = R._;
  const should = R.should;
  const React = R.React;
  const url = require('url');

  return ({ storeName, dispatcherName }) => {
    _.dev(() => storeName.should.be.a.String &&
      dispatcherName.should.be.a.String
    );

    class History extends R.App.Plugin {
      constructor({ flux, window, req, headers }) {
        super(...arguments);
        let store = flux.getStore(storeName);
        if(window) {
          let dispatcher = flux.getDispatcher(dispatcherName);
          dispatcher.addActionHandler('/History/navigate', ({ pathname }) => Promise.try(() => {
            _.dev(() => pathname.should.be.a.String);
            let href = url.format(_.extend(url.parse(window.location.href)), { pathname });
            window.history.pushState(null, null, href);
            this.navigate(href);
          }));
          window.addEventListener('popstate', () => this.navigate(window.location.href));
          this.navigate(window.location.href);
        }
        else {
          this.navigate(url.parse(req.url).pathname);
        }
      }

      navigate(href) {
        let store = this.flux.getStore(storeName);
        _.dev(() => store.set.should.be.a.Function);
        return store.set('/History/pathname', url.parse(href).pathname);
      }

      getDisplayName() {
        return 'History';
      }
    }

    return History;
  };
};
