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
      this._pending = {};
    }

    getDisplayName() {
      return 'HTTPStore';
    }

    destroy() {
      super.destroy();
      // Explicitly nullify pendings
      Object.keys(this._pending)
      .forEach((path) => {
        this._pending[path].cancel(new Error('HTTPStore destroy'));
        this._pending[path] = null;
      });
      // Nullify references
      this._pending = null;
      this._http = null;
    }

    fetch(path) {
      this._shouldNotBeDestroyed();
      _.dev(() => path.should.be.a.String);
      if(!this._pending[path]) {
        this._pending[path] = this._http.fetch(path).cancellable();
        _.dev(() => this._pending[path].then.should.be.a.Function);
      }
      return this._pending[path];
    }
  }

  _.extend(HTTPStore.prototype, {
    _http: null,
    _pending: null,
  });

  return HTTPStore;
};

