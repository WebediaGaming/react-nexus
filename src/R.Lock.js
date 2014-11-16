module.exports = function(R) {
  const _ = R._;

  class Lock {
    constructor() {
      this._acquired = false;
      this._queue = [];
    }

    acquire() {
      return new Promise((resolve, reject) => {
        if(!this._acquired) {
          this._acquired = true;
          return resolve();
        }
        else {
          return this._queue.push({ resolve, reject });
        }
      });
    }

    release() {
      _.dev(() => this._acquired.should.be.ok);
      if(this._queue.length > 0) {
        let { resolve } = this._queue[0];
        this._queue.shift();
        resolve();
      }
      else {
        this._acquired = false;
      }
    }

    perform(fn) {
      return _.copromise(function*() {
        yield this.acquire();
        let res = yield fn();
        this.release();
        return res;
      }, this);
    }
  }

  _.extend(Lock.prototype, {
    _acquired: null,
    _queue: null,
  });

  return Lock;
};
