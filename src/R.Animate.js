module.exports = function(R) {
  const _ = R._;
  const should = R.should;
  const d3 = require('d3');
  const raf = require('raf');

  class InterpolationTicker {
    constructor() {
      _.dev(() => params.should.be.an.Object);
      _.defaults(params, {
        easing: 'cubic-in-out',
        onTick: _.noop,
        onComplete: _.noop,
        onAbort: _.noop,
      });

      _.dev(() =>
        params.from.should.be.an.Object &&
        params.to.should.be.an.Object &&
        params.duration.should.be.a.Number &&
        (_.isPlainObject(params.easing) || _.isString(params.easing)).should.be.ok &&
        params.onTick.should.be.a.Function &&
        params.onComplete.should.be.a.Function &&
        params.onAbort.should.be.a.Function
        );

      this._from = params.from;
      this._to = params.to;

      Object.keys(this._from)
      .forEach((attr) => _.has(this._to, attr) ? this._to[attr] = this._from[attr] : void 0);
      Object.keys(this._to)
      .forEach((attr) => _.has(this._from, attr) ? this._from[attr] = this._to[attr] : void 0);

      if(_.isPlainObject(params.easing)) {
        _.dev(() => params.easing.type.should.be.a.String &&
          params.easing.params.should.be.an.Object
        );
        this._easing = R.Animate.createEasing(params.easing.type, params.easing.params);
      }
      else {
        this._easing = R.Animate.createEasing(params.easing);
      }
      this._duration = params.duration;
      this._onTick = params.onTick;
      this._onComplete = params.onComplete;
      this._onAbort = params.onAbort;
      this._interpolators = _.mapValues(this._from, (fromVal, attr) => R.Animate.createInterpolator(fromVal, this._to[attr]));
      this._tick = R.scope(this._tick, this);
    }

    start() {
      _.dev(() => (this._begin === null).should.be.ok);
      this._begin = Date.now();
      this._end = this._begin + this._duration;
      this._requestAnimationFrameHandle = raf(this._tick);
    }

    _tick() {
      let now = Date.now();
      if(now > this._end) {
        this._onTick(this._to, t);
        this._onComplete();
      }
      else {
        let t = (now - this._begin)/(this._end - this._begin);
        this._onTick(_.mapValues(this._interpolators, (interpolator) => interpolator(this._easing(t)), t));
        this._requestAnimationFrameHandle = raf(this._tick);
      }
    }

    abort() {
      if(this._requestAnimationFrameHandle) {
        raf.cancel(this._requestAnimationFrameHandle);
        this._requestAnimationFrameHandle = null;
      }
    }
  }


  _.extend(InterpolationTicker.prototype, /** @lends R.Animate.InterpolationTicker.prototype */ {
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
  });

  const Animate = {
    Mixin: {
      _AnimateMixinHasAnimateMixin: true,
      _AnimateMixinInterpolationTickers: null,

      componentWillMount() {
        this._AnimateMixinInterpolationTickers = {};
      },

      componentWillUnmount() {
        Object.keys(this._AnimateMixinInterpolationTickers)
        .forEach((name) => this._AnimateMixinInterpolationTickers[name].abort());
        this._AnimateMixinInterpolationTickers = null;
      },

      isAnimating(name) {
        return this._AnimateMixinInterpolationTickers[name];
      },

      _AnimateMixinGetStateKey(name) {
        return '_AnimateMixinStyle-' + name;
      },

      getAnimatedStyle(name) {
        if(this.isAnimating(name)) {
          return this.state[this._AnimateMixinGetStateKey(name)];
        }
        else {
          _.dev(() => console.warn('R.Animate.Mixin.getAnimatedStyle(...): no such animation.'));
          return {};
        }
      },

      abortAnimation(name) {
        _.dev(() => this.isAnimating(name).should.be.ok);
        if(this.isAnimating(name)) {
          this._AnimateMixinInterpolationTickers[name].abort();
        }
      },

      animate(name, params) {
        if(this.isAnimating(name)) {
          this.abortAnimation(name);
        }

        params = _.extend({}, params, {
          onTick: _.noop,
          onComplete: _.noop,
          onAbort: _.noop,
        });

        let original = {
          onTick: params.onTick,
          onComplete: params.onComplete,
          onAbort: params.onAbort,
        };

        params.onTick = (animatedStyle, t) => {
          original.onTick(animatedStyle, t);
          this.setStateIfMounted({ [this._AnimateMixinGetStateKey(name)]: animatedStyle });
        };

        params.onComplete = (animatedStyle, t) => {
          original.onComplete(animatedStyle, t);
          delete this._AnimateMixinInterpolationTickers[name];
          this.setStateIfMounted({ [this._AnimateMixinGetStateKey(name)]: void 0 });
        };

        params.onAbort = () => {
          original.onAbort();
          delete this._AnimateMixinInterpolationTickers[name];
          this.setStateIfMounted({ [this._AnimateMixinGetStateKey(name)]: void 0 });
        };

        let interpolationTicker = new R.Animate.InterpolationTicker(params);
        this._AnimateMixinInterpolationTickers[name] = interpolationTicker;
        interpolationTicker.start();
      },
    },

    createInterpolator(from, to) {
      return d3.interpolate(from, to);
    },

    createEasing(type, params) {
      if(params) {
        let args = _.clone(params);
        args.unshift(type);
        return d3.ease.apply(d3, args);
      }
      else {
        return d3.ease(type);
      }
    },

    InterpolationTicker,

    shouldEnableHA() {
      if(_.isClient()) {
        let userAgent = navigator.userAgent;
        let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        let isGingerbread = /Android 2\.3\.[3-7]/i.test(userAgent);
        return userAgent && isMobile && !isGingerbread;
      }
      else {
        return true;
      }
    },
  };

  return Animate;
};
