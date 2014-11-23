module.exports = function(R) {
  const _ = R._;
  const url = require('url');

  function Plugin({ storeName, dispatcherName }) {
    _.dev(() => storeName.should.be.a.String &&
      dispatcherName.should.be.a.String
    );

    class History extends R.App.Plugin {
      constructor({ flux, window, req }) {
        super(...arguments);
        if(_.isClient()) {
          const dispatcher = flux.getDispatcher(dispatcherName);
          dispatcher.addActionHandler('/History/navigate', ({ pathname }) => Promise.try(() => {
            _.dev(() => pathname.should.be.a.String);
            const urlObj = _.extend(url.parse(window.location.href), { pathname });
            window.history.pushState(null, null, url.format(urlObj));
            this.navigate(urlObj);
          }));
          window.addEventListener('popstate', () => this.navigate(window.location.href));
          this.navigate(url.parse(window.location.href));
        }
        else {
          this.navigate(url.parse(req.url));
        }
      }

      destroy() {
        // No-op.
        // TODO: Improve in the browser.
      }

      navigate(urlObj) {
        const store = this.flux.getStore(storeName);
        _.dev(() => store.set.should.be.a.Function &&
          urlObj.should.be.an.Object
        );
        return store.set('/History/location', urlObj);
      }

      getDisplayName() {
        return 'History';
      }
    }

    return History;
  }

  return Plugin;
};
