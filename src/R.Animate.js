module.exports = function(R) {
  const _ = R._;
  const d3 = require('d3');
  const InterpolationTicker = require('./R.Animate.InterpolationTicker')(R);

  const Animate = {
    Mixin: {
      _AnimateMixin: true,
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
