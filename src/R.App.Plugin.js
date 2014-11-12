module.exports = function(R) {
  const _ = R._;
  const should = R.should;

  class Plugin {
    constructor({ flux, req, window, headers }) {
      _.dev(() => flux.should.be.an.instanceOf(R.Flux) &&
        headers.should.be.an.Object
      );
      _.dev(() => _.isServer() ? req.should.be.an.Object : window.should.be.an.Object);
      this.displayName = this.getDisplayName();
      this.flux = flux;
      this.window = window;
      this.req = req;
      this.headers = headers;
    }

    getDisplayName() { _.abstract(); }

    destroy() { _.abstract(); }
  }

  _.extend(Plugin.prototype, /** @lends Plugin.Prototype */ {
    flux: null,
    window: null,
    req: null,
    headers: null,
    displayName: null,
  });

  return Plugin;
};
