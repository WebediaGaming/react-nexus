module.exports = function(R) {
  const _ = R._;
  const should = R.should;
  const React = R.React;
  const Locales = require('locale').Locales;

  return ({ storeName, dispatcherName, supportedLocales }) => {
    _.dev(() => storeName.should.be.a.String &&
      dispatcherName.should.be.a.String &&
      supportedLocales.should.be.an.Array
    );

    let parsedLocales = new Locales(supportedLocales);

    class Localize extends R.App.Plugin {
      constructor({ flux, window, req, headers }) {
        super.apply(this, arguments);

        _.dev(() => this.headers['accept-language'].should.be.a.String);
        let defaultLocale = this.extractLocale();

        let store = this.flux.getStore(storeName);
        _.dev(() => store.set.should.be.a.Function);

        if(window) {
          let dispatcher = this.flux.getDispatcher(dispatcherName);
          dispatcher.addActionHandler('/Localize/setLocale', ({ locale }) => Promise.try(() => {
            _.dev(() => locale.should.be.a.String);
            let bestLocale = this.bestLocale(locale);
            store.set('/Localize/locale', bestLocale);
          }));
        }
          // Only set if nothings' previously filled this
        if(!store.hasCachedValue('/Localize/locale')) {
          store.set('/Localize/locale', defaultLocale);
        }
      }

      bestLocale(accepted) {
        let acceptedLocales = new Locales(accepted);
        return acceptedLocales.best(parsedLocales);
      }

      getDisplayName() {
        return 'Localize';
      }
    }
  };
};
