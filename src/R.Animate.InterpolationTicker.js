module.exports = function(R) {
  const _ = R._;
  const raf = require('raf');

  class InterpolationTicker {
    constructor({ from, to, duration, easing, onTick, onComplete, onAbort }) {
      easing = easing || 'cubic-in-out';
      onTick = onTick || _.noop;
      onComplete = onComplete || _.noop;
      onAbort = onAbort || _.noop;

      _.dev(() =>
        from.should.be.an.Object &&
        to.should.be.an.Object &&
        duration.should.be.a.Number &&
        (_.isPlainObject(easing) || _.isString(easing)).should.be.ok &&
        onTick.should.be.a.Function &&
        onComplete.should.be.a.Function &&
        onAbort.should.be.a.Function
      );

      this._from = from;
      this._to = to;

      Object.keys(this._from)
      .forEach((attr) => _.has(this._to, attr) ? this._to[attr] = this._from[attr] : void 0);
      Object.keys(this._to)
      .forEach((attr) => _.has(this._from, attr) ? this._from[attr] = this._to[attr] : void 0);

      if(_.isPlainObject(easing)) {
        _.dev(() => easing.type.should.be.a.String &&
          easing.params.should.be.an.Object
        );
        this._easing = R.Animate.createEasing(easing.type, easing.params);
      }
      else {
        this._easing = R.Animate.createEasing(easing);
      }
      this._duration = duration;
      this._onTick = onTick;
      this._onComplete = onComplete;
      this._onAbort = onAbort;
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
        this._onTick(this._to, 1);
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
