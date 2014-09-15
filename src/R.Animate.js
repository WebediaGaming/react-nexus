var R = require("./R");
var _ = require("lodash");
var assert = require("assert");
var d3 = R.d3;
var raf = require("raf");
var Animate = {
    Mixin: {
        _AnimateMixinHasAnimateMixin: true,
        _AnimateMixinInterpolationTickers: null,
        componentWillMount: function componentWillMount() {
            this._AnimateMixinInterpolationTickers = {};
        },
        componentWillUnmount: function componentWillUnmount() {
            _.each(this._AnimateMixinInterpolationTickers, function(interpolationTicker) {
                interpolationTicker.abort();
            });
            this._AnimateMixinInterpolationTickers = null;
        },
        isAnimating: function isAnimating(name) {
            return _.has(this._AnimateMixinInterpolationTickers, name);
        },
        _AnimateMixinGetStateKey: function _AnimateMixinGetStateKey(name) {
            return "_AnimateMixinStyle-" + name;
        },
        getAnimatedStyle: function getAnimatedStyle(name) {
            if(this.isAnimating(name)) {
                return this.state[this._AnimateMixinGetStateKey(name)];
            }
            else {
                R.Debug.dev(function() {
                    console.warn("R.Animate.Mixin.getAnimatedStyle(...): no such animation.");
                });
                return {};
            }
        },
        abortAnimation: function abortAnimation(name) {
            R.Debug.dev(R.scope(function() {
                assert(this.isAnimating(name), "R.Animate.Mixin.abortAnimation(...): no such animation.");
            }, this));
            if(this.isAnimating(name)) {
                this._AnimateMixinInterpolationTickers[name].abort();
            }
        },
        animate: function animate(name, params) {
            if(this.isAnimating(name)) {
                this.abortAnimation(name);
            }
            params = _.extend({}, params, {
                onTick: _.noop,
                onComplete: _.noop,
                onAbort: _.noop,
            });
            var original = {
                onTick: params.onTick,
                onComplete: params.onComplete,
                onAbort: params.onAbort,
            };
            params.onTick = R.scope(function(animatedStyle, t) {
                original.onTick(animatedStyle, t);
                this.setStateIfMounted(R.record(this._AnimateMixinGetStateKey(name), animatedStyle));
            }, this);
            params.onComplete = R.scope(function(animatedStyle, t) {
                original.onComplete(animatedStyle, t);
                this.setStateIfMounted(R.record(this._AnimateMixinGetStateKey(name), animatedStyle));
            }, this);
            params.onAbort = R.scope(function() {
                original.onAbort();
                this.setStateIfMounted(R.record(this._AnimateMixinGetStateKey(name), void 0));
                delete this._AnimateMixinInterpolationTickers[name];
            }, this);
            var interpolationTicker = new R.Animate.InterpolationTicker(params);
            this._AnimateMixinInterpolationTickers[name] = interpolationTicker;
            interpolationTicker.start();
        },
    },
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
        _.each(R.Animate.transformAttributes, R.scope(function(attr) {
            if(!_.has(this._from, attr)) {
                this._from[attr] = "translateZ(0)";
            }
            else {
                this._from[attr] = "translateZ(0) " + this._from[attr];
            }
            if(!_.has(this._to, attr)) {
                this._to[attr] = "translateZ(0)";
            }
            else {
                this._to[attr] = "translateZ(0) " + this._to[attr];
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
    shouldEnableHA: function shouldEnableHA() {
        if(R.isClient()) {
            var userAgent = navigator.userAgent;
            var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
            var isGingerbread = /Android 2\.3\.[3-7]/i.test(userAgent);
            return userAgent && isMobile && !isGingerbread;
        }
        else {
            return true;
        }
    },
    transformAttributes: ["WebkitTransform", "MozTransform", "MSTransform", "OTransform", "Transform"],
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
            this._onTick(this._to, t);
            this._onComplete();
        }
        else {
            var t = (now - this._begin)/(this._end - this._begin);
            this._onTick(_.mapValues(this._interpolators, R.scope(function(interpolator) {
                return interpolator(this._easing(t));
            }, this)), t);
            this._requestAnimationFrameHandle = raf(this._tick);
        }
    },
    abort: function abort() {
        if(this._requestAnimationFrameHandle) {
            this._requestAnimationFrameHandle.cancel();
            this._requestAnimationFrameHandle = null;
        }
    },
});

module.exports = {
    Animate: Animate,
};
