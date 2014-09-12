var R = require("../");
var _ = require("lodash");

var EventEmitter = {
    createEventEmitter: function createEventEmitter(specs) {
        R.Debug.dev(function() {
            assert(_.isObject(specs), "R.EventEmitter.createEventEmitter(...): expecting an Object as specs.");
            assert(_.has(specs, "displayName") && _.isString(specs.displayName), "R.EventEmitter.createEventEmitter(...): requires displayName(String).");
            assert(_.has(specs, "addListener") && _.isFunction(specs.addListener), "R.EventEmitter.createEventEmitter(...): requires addListener(String, Function): R.EventEmitter.Listener.");
            assert(_.has(specs, "removeListener") && _.isFunction(specs.removeListener), "R.EventEmitter.createEventEmitter(...)");
        });
        /**
         * @class
         * @memberOf R.EventEmitter
         * @public
         */
        var EventEmitterInstance = function EventEmitterInstance() {};
        _.extend(EventEmitter.prototype, specs, {
            /**
             *  Type dirty-checking.
             *  @private
             *  @readOnly
             */
            _isEventEmitterInstance_: true,
        });
        return EventEmitterInstance;
    },
    Listener: function Listener(event) {
        this.uniqueId = _.uniqueId("Listener");
        this.event = event;
    },
    MemoryEventEmitter: function MemoryEventEmitter() {
        var listeners = {};
        var addListener = function addListener(event, fn) {
            var listener = new R.EventEmitter.Listener(event);
            if(!_.has(listeners, event)) {
                listeners[event] = {};
            }
            listeners[event][listener.uniqueId] = fn;
        };
        var removeListener = function removeListener(listener) {
            R.Debug.dev(function() {
                assert(listener instanceof R.EventEmitter.Listener, "R.EventEmitter.MemoryEventEmitter.removeListener(...): type R.EventEmitter.Listener expected.");
                assert(_.has(listeners, listener.event), "R.EventEmitter.MemoryEventEmitter.removeListener(...): no listeners for this event.");
                assert(_.has(listeners[listener.event], listener.uniqueId), "R.EventEmitter.MemoryEventEmitter.removeListener(...): no such listener.");
            });
            delete listeners[listener.event][listener.uniqueId];
            if(_.size(listeners[listener.event])) {
                delete listeners[listener.event];
            }
        };
        var emit = function emit(event, params) {
            params = params || {};
            if(_.has(listeners, event)) {
                _.each(listeners[event], R.callWith(params));
            }
        };
        return new R.EventEmitter.createEventEmitter({
            addListener: addListener,
            removeListener: removeListener,
            emit: emit,
        });
    },
    UplinkEventEmitter: function UplinkEventEmitter(upAddListener, upRemoveListener) {
        var listeners = {};
        var addListener = function addListener(event, fn) {
            var listener = new R.EventEmitter.Listener(event);
            if(!_.has(listeners, event)) {
                upAddListener(event);
                listeners[event] = {};
            }
            listeners[event][listener.uniqueId] = fn;
        };
        var removeListener = function removeListener(listener) {
            R.Debug.dev(function() {
                assert(listener instanceof R.EventEmitter.Listener, "R.EventEmitter.UplinkEventEmitter.removeListener(...): type R.EventEmitter.Listener expected.");
                assert(_.has(listeners, listener.event), "R.EventEmitter.UplinkEventEmitter.removeListener(...): no listeners for this event.");
                assert(_.has(listeners[listener.event], listener.uniqueId), "R.EventEmitter.UplinkEventEmitter.removeListener(...): no such listener.");
            });
            delete listeners[listener.event][listener.uniqueId];
            if(_.size(listeners[listener.event])) {
                upRemoveListener(event);
                delete listeners[listener.event];
            }
        };
        var emit = function emit(event, params) {
            params = params || {};
            if(_.has(listeners, event)) {
                _.each(listeners[event], R.callWith(params));
            }
        };
        return new R.EventEmitter.createEventEmitter({
            addListener: addListener,
            removeListener: removeListener,
            emit: emit,
        });
    },
};

_.extend(EventEmitter.Listener.prototype, /** @lends R.EventEmitter.Listener.prototype */ {
    /**
     * @type {String}
     * @public
     * @readOnly
     */
    uniqueId: null,
    /**
     * @type {String}
     * @public
     * @readOnly
     */
    event: null,
});

module.exports = {
    EventEmitter: EventEmitter,
};
