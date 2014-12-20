module.exports = function(R, Dispatcher) {
  const _ = R._;

  class UplinkDispatcher extends Dispatcher {
    constructor({ uplink }) {
      // Ducktype-check uplink (since we dont have access to the constructor)
      _.dev(() => (uplink !== void 0).should.be.ok &&
        uplink.listenTo.should.be.a.Function &&
        uplink.unlistenFrom.should.be.a.Function
      );
      super();
      _.extend(this, {
        _uplink: uplink,
      });
    }

    *dispatch(action, params = {}) { // jshint ignore:line
      _.dev(() => action.should.be.a.String &&
        (params === null || _.isObject(params)).should.be.ok
      );
      return yield this._uplink.dispatch(action, params); // jshint ignore:line
    }
  }

  _.extend(UplinkDispatcher.prototype, {
    _uplink: null,
  });

  return UplinkDispatcher;
};
