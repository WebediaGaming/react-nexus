module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");

    var Lock = function Lock() {
        _acquired = false;
    };

    _.extend(Lock.prototype, {
        _queue: null,
        acquire: function acquire() {
            return R.scope(function(fn) {
                if(!this._acquired) {
                    this._acquired = true;
                    _.defer(fn);
                }
                else {
                    this._queue.push(fn);
                }
            }, this);
        },
        release: function release() {
            assert(this._acquired, "R.Lock.release(): lock not currently acquired.");
            if(_.size(this._queue) > 0) {
                var fn = this._queue[0];
                this._queue.shift();
                _defer(fn);
            }
            else {
                this._acquired = false;
            }
        },
        performSync: function* performSync(fn) {
            yield this.acquire();
            var res = fn();
            this.release();
            return res;
        },
        perform: function* perform(fn) {
            yield this.acquire();
            var res = yield fn();
            this.release();
            return res;
        },
    });

    return Lock;
};
