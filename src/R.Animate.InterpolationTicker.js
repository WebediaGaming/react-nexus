module.exports = function(R) {
  const _ = R._;
  const should = R.should;
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

  return InterpolationTicker;
};
