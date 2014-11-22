module.exports = function(R) {
  const _ = R._;
  const Locales = require('locale').Locales;

  function bestLocale(acceptedLocales, supportedLocales) {
    let accepted = new Locales(acceptedLocales);
    let supported = new Locales(supportedLocales);
    return accepted.best(supported);
  }

  return _.extend(({ storeName, dispatcherName, supportedLocales }) => {
    _.dev(() => storeName.should.be.a.String &&
      dispatcherName.should.be.a.String &&
      supportedLocales.should.be.an.Array
    );

    class Localize extends R.App.Plugin {
      constructor({ flux, window, req, headers }) {
        super(...arguments);

        _.dev(() => headers['accept-language'].should.be.a.String);
        let defaultLocale = bestLocale(headers['accept-language'], supportedLocales);

        let store = this.flux.getStore(storeName);
        _.dev(() => store.set.should.be.a.Function);

        if(window) {
          let dispatcher = this.flux.getDispatcher(dispatcherName);
          dispatcher.addActionHandler('/Localize/setLocale', ({ locale }) => Promise.try(() => {
            _.dev(() => locale.should.be.a.String);
            store.set('/Localize/locale', bestLocale(locale, supportedLocales));
          }));
        }
          // Only set if nothings' previously filled this
        if(!store.hasCachedValue('/Localize/locale')) {
          store.set('/Localize/locale', defaultLocale);
        }
      }

      getDisplayName() {
        return 'Localize';
      }
    }

    return Localize;
  }, { bestLocale });
};
