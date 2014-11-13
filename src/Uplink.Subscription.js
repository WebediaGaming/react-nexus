const _ = require('lodash-next');
const should = _.should;

class Subscription {
	constructor({ path, handler }) {
    _.dev(() => path.should.be.a.String &&
      handler.should.be.a.Function
    );
    _.extend(this, { path, handler, id: _.uniqueId(path) });
	}

  addTo(subscriptions) {
    _.dev(() => subscriptions.should.be.an.Object);
    if(!subscriptions[this.path]) {
      subscriptions[this.path] = {};
    }
    _.dev(() => subscriptions[this.path].should.be.an.Object &&
      subscriptions[this.path][this.id].should.not.be.ok
    );
    subscriptions[this.path][this.id] = this;
    return Object.keys(subscriptions[this.path]).length === 1;
  }

  removeFrom(subscriptions) {
    _.dev(() => subscriptions.should.be.an.Object &&
      subscriptions[this.path].shoulbe.be.an.Object &&
      subscriptions[this.path][this.id].should.be.exactly(this)
    );
    delete subscriptions[this.path][this.id];
    if(Object.keys(subscriptions[this.path]).length === 0) {
      delete subscriptions[this.path];
      return true;
    }
    return false;
  }

  update(value) {
    _.dev(() => (value === null || _.isObject(value)).should.be.ok);
    this.handler.call(null, value);
  }
}

_.extend(Subscription.prototype, {
	path: null,
  handler: null,
	id: null,
});

module.exports = Subscription;
