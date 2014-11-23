module.exports = function(R) {
  const _ = R._;
  const React = R.React;

  class Client {
    constructor({ app }) {
      _.dev(() => (__BROWSER__).should.be.ok &&
        window.React.should.be.ok &&
        app.should.be.an.instanceOf(R.App)
      );
      this.app = app;
      this.rendered = false;
    }

    *mount({ window }) { // jshint ignore:line
      _.dev(() => window.should.be.an.Object &&
        this.rendered.should.not.be.ok
      );
      window.React = React;
      this.rendered = true;
      return yield this.app.render({ window }); // jshint ignore:line
    }
  }

  _.extend(Client.prototype, /** @lends Client */{
    app: null,
    rendered: null,
  });

  return Client;
};
