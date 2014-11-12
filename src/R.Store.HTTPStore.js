module.exports = function(R, Store) {
  const _ = R._;
  const should = R.should;

  class HTTPStore extends Store {
    constructor({ http }) {
      _.dev(() => http.shoud.be.an.Object &&
        http.fetch.should.be.a.Function
      );
      super(...arguments);
      this._http = http;
    }

    getDisplayName() {
      return 'HTTPStore';
    }
  }

  _.extend(HTTPStore.prototype, {
    _http: null,
  });

  return HTTPStore;
};

