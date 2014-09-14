var R = require("./R");
var lodash = require("lodash");
var d3 = R.d3;
var raf = require("raf");
var Animate = {
    createInterpolator: function createInterpolator(from, to) {
        return d3.interpolate(from, to);
    },
    createEasing: function createEasing(type, params) {
        if(params) {
            var args = _.clone(params);
            args.unshift(type);
            return d3.ease.apply(d3, args);
        }
        else {
            return d3.ease(type);
        }
    },
    InterpolationTicker: function InterpolationTicker(params) {
        R.Debug.dev(function() {
            assert(_.isPlainObject(params), "R.Animate.InterpolationTicker(...).params: expected Object.");
        });
        params = _.extend({}, params, {
            from: null,
            to: null,
            easing: "cubic-in-out",
            duration: null,
            onTick: _.noop,
            onComplete: _.noop,
            onAbort: _.noop,
        });
        R.Debug.dev(function() {
            assert(params.from && _.isPlainObject(params.from), "R.Animate.InterpolationTicker(...).params.from: expected Object.");
            assert(params.to && _.isPlainObject(params.to), "R.Animate.InterpolationTicker(...).params.to: expected Object.");
            assert(params.duration && _.isNumber(params.duration), "R.Animate.InterpolationTicker(...).params.duration: expected Number.");
            assert(params.easing && (_.isPlainObject(params.easing) || _.isString(params.easing)), "R.Animate.InterpolationTicker(...).params.easing: expected { type: String, params: Object } or String.");
        });
        this._from = params.from;
        this._to = params.to;
        _.each(this._from, R.scope(function(val, attr) {
            if(!_.has(this._to, attr)) {
                this._to[attr] = val;
            }
        }, this));
        _.each(this._to, R.scope(function(val, attr) {
            if(!_.has(this._from, attr)) {
                this._from[attr] = val;
            }
        }, this));
        if(_.isPlainObject(params.easing)) {
            R.Debug.dev(function() {
                assert(_.has(params.easing, "type") && _.isString(params.easing.type), "R.Animate.InterpolationTicker(...).params.easing: expected { type: String, params: Object }.");
                assert(_.has(params.easing, "params") && _.isString(params.easing.params), "R.Animate.InterpolationTicker(...).params.easing: expected { type: String, params: Object }.");
            });
            this._easing = R.Animate.createEasing(params.easing.type, params.easing.params);
        }
        else {
            this._easing = R.Animate.createEasing(params.easing);
        }
        this._duration = params.duration;
        this._onTick = params.onTick;
        this._onComplete = params.onComplete;
        this._onAbort = params.onAbort;
        this._interpolators = _.mapValues(this._from, R.scope(function(fromVal, attr) {
            var toVal = this._to[attr];
            return R.Animate.createInterpolator(fromVal, toVal);
        }, this));
        this._tick = R.scope(this._tick, this);
    },
};

_.extend(Animate.InterpolationTicker.prototype, /** @lends R.Animate.InterpolationTicker.prototype */ {
    _from: null,
    _to: null,
    _easing: null,
    _duration: null,
    _onTick: null,
    _onComplete: null,
    _onAbort: null,
    _requestAnimationFrameHandle: null,
    _begin: null,
    _end: null,
    _interpolators: null,
    start: function start() {
        R.Debug.check(this._begin === null, "R.Animate.InterpolationTicker.start(...): animation already started.");
        this._begin = Date.now();
        this._end = this._begin + this._duration;
        this._requestAnimationFrameHandle = raf(this._tick);
    },
    _tick: function _tick() {
        var now = Date.now();
        if(now > this._end) {
            this._onTick(1, this._to);
            this._onComplete();
        }
        else {
            var t = (now - this._begin)/(this._end - this._begin);
            this._onTick(1, _.mapValues(this._interpolators, R.scope(function(interpolator, attr) {
                return interpolator(this._easing(t));
            }, this)));
            this._requestAnimationFrameHandle = raf(this._tick);
        }
    },
    abort: function abort() {
        if(this._requestAnimationFrameHandle) {
            this._requestAnimationFrameHandle.cancel();
            this._requestAnimationFrameHandle = null;
        }
    },
    tick: function tick() {

    },
});

module.exports = {
    Animate: Animate,
};
