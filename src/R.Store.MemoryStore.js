module.exports = function(R, Store) {
  const _ = R._;

  class MemoryStore extends Store {
    constructor() {
      super();
      this._data = {};
    }

    destroy() {
      super.destroy();
      // Explicitly nullify data
      Object.keys(this._data)
      .forEach((path) => this._data[path] = null);
      // Nullify references
      this._data = null;
    }

    fetch(path) {
      return Promise.try(() => {
        _.dev(() => path.should.be.a.String);
        this._shouldNotBeDestroyed();
        _.dev(() => _.has(this._data, path).should.be.ok);
        return this._data[path];
      });
    }

    set(path, value) {
      _.dev(() => path.should.be.a.String &&
        (null === value || _.isObject(value)).should.be.ok
      );
      this._shouldNotBeDestroyed();
      this._data[path] = value;
      this.propagateUpdate(path, value);
    }
  }

  _.extend(MemoryStore.prototype, {
    _data: null,
  });

  return MemoryStore;
};
