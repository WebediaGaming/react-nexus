module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");

    var Lock = function Lock() {
        this._acquired = false;
        this._queue = [];
    };

    _.extend(Lock.prototype, {
        _acquired: null,
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
                _.defer(fn);
            }
            else {
                this._acquired = false;
            }
        },
        performSync: regeneratorRuntime.mark(function performSync(fn) {
            var res;

            return regeneratorRuntime.wrap(function performSync$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return this.acquire();
                case 2:
                    res = fn();
                    this.release();
                    return context$2$0.abrupt("return", res);
                case 5:
                case "end":
                    return context$2$0.stop();
                }
            }, performSync, this);
        }),
        perform: regeneratorRuntime.mark(function perform(fn) {
            var res;

            return regeneratorRuntime.wrap(function perform$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return this.acquire();
                case 2:
                    context$2$0.next = 4;
                    return fn();
                case 4:
                    res = context$2$0.sent;
                    this.release();
                    return context$2$0.abrupt("return", res);
                case 7:
                case "end":
                    return context$2$0.stop();
                }
            }, perform, this);
        }),
    });

    return Lock;
};
