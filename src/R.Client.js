module.exports = function(R) {
  const _ = R._;
  const should = R.should;
  const React = R.React;

  _.dev(() => _.isClient().should.be.ok);
  window.React = React;

  /**
  * <p>Simply provides an specified App for the client</p>
  * <p>Provides instance of App </p>
  * <ul>
  * <li> Client.mount => compute all React Components client-side and establishes a connection via socket in order to make data subscriptions </li>
  * </ul>
  * @class R.Client
  */

  class Client {
    constructor(App) {
      _.dev(() => window.React.should.be.ok);
      this.app = new App();
      this.rendered = false;
    }

    mount() {
      return _.copromise(function*() {
        _.dev(() => this.rendered.should.not.be.ok);
        this.rendered = true;
        yield this.app.renderIntoDocumentInClient(window);
      }, this);
    }
  }

  _.extend(Client.prototype, /** @lends Client */{
    app: null,
    rendered: null,
  });

  return Client;
};
