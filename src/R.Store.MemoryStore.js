module.exports = function(R, Store) {
  const _ = R._;
  const should = R.should;

  class MemoryStore extends Store {
    constructor() {
      super(...arguments);
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

    getDisplayName() {
      return 'MemoryStore';
    }

    fetch(path) {
      return Promise.try(() => {
        _.dev(() => _.has(this._data, path).should.be.ok);
        return this._data[path];
      });
    }

    set(path, value) {
      this._shouldNotBeDestroyed();
      this._data[path] = value;
      if(this.subscriptions[path]) {
        Object.keys(this.subscriptions[path])
        .forEach((key) => this.subscriptions[path].update(value));
      }
    }
  }

  _.extend(MemoryStore.prototype, {
    _data: null,
  });

  return MemoryStore;
};
