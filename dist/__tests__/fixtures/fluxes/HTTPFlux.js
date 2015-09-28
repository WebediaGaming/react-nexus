'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createDecoratedClass = require('babel-runtime/helpers/create-decorated-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _typecheckDecorator = require('typecheck-decorator');

var _typecheckDecorator2 = _interopRequireDefault(_typecheckDecorator);

var _2 = require('../../..');

var __DEV__ = process.env.NODE_ENV === 'development';

var optNumber = _typecheckDecorator2['default'].option(_typecheckDecorator2['default'].Number());

var valueShape = _typecheckDecorator2['default'].shape([_typecheckDecorator2['default'].option(_typecheckDecorator2['default'].oneOf(_typecheckDecorator2['default'].instanceOf(Error), _typecheckDecorator2['default'].String())), _typecheckDecorator2['default'].any(), _typecheckDecorator2['default'].option(_typecheckDecorator2['default'].oneOf(_typecheckDecorator2['default'].instanceOf(Date), _typecheckDecorator2['default'].String()))]);
var valuesType = _typecheckDecorator2['default'].Array({ type: valueShape });

var optionsShape = _typecheckDecorator2['default'].shape({
  maxRequestDuration: optNumber,
  maxAgents: optNumber
});
var defaultOptions = {
  maxRequestDuration: 30000,
  maxAgents: 1000
};

var paramsShape = _typecheckDecorator2['default'].shape({
  path: _typecheckDecorator2['default'].String(),
  query: _typecheckDecorator2['default'].Object(),
  refreshEvery: optNumber
});
var defaultParams = {
  query: {},
  refreshEvery: void 0
};

var HTTPFlux = (function (_Flux) {
  _inherits(HTTPFlux, _Flux);

  _createDecoratedClass(HTTPFlux, null, [{
    key: 'unserialize',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].instanceOf(HTTPFlux)), _typecheckDecorator.takes(_typecheckDecorator2['default'].shape({
      baseUrl: _typecheckDecorator2['default'].String(),
      options: optionsShape,
      data: _typecheckDecorator2['default'].Object({ type: valuesType })
    }))],
    value: function unserialize(_ref) {
      var baseUrl = _ref.baseUrl;
      var options = _ref.options;
      var data = _ref.data;

      return new HTTPFlux(baseUrl, options, data);
    }
  }, {
    key: 'keyFor',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].String()), _typecheckDecorator.takes(paramsShape)],
    value: function keyFor(params) {
      return JSON.stringify(params);
    }
  }, {
    key: 'displayName',
    value: 'HTTPFlux',
    enumerable: true
  }]);

  function HTTPFlux(baseUrl) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, HTTPFlux);

    _Flux.call(this);
    if (__DEV__) {
      _typecheckDecorator2['default'].String()(baseUrl);
      optionsShape(options);
      _typecheckDecorator2['default'].Object({ type: valuesType })(data);
    }
    this.originalOptions = options;
    this.options = _lodash2['default'].defaults({}, options, defaultOptions);
    this.baseUrl = baseUrl;
    this.data = data;
    this.promises = _lodash2['default'].mapValues(data, function (_ref2) {
      var err = _ref2[0];
      var res = _ref2[1];
      return _bluebird2['default'].resolve([err, res]);
    });
    this.observers = {};
    this.refreshers = {};
  }

  _createDecoratedClass(HTTPFlux, [{
    key: 'serialize',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].shape({
      baseUrl: _typecheckDecorator2['default'].String(),
      options: optionsShape,
      data: _typecheckDecorator2['default'].Object({ type: valuesType })
    }))],
    value: function serialize() {
      return {
        baseUrl: this.baseUrl,
        options: this.originalOptions,
        data: this.data
      };
    }
  }, {
    key: 'pushValue',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].instanceOf(HTTPFlux)), _typecheckDecorator.takes(_typecheckDecorator2['default'].String(), valueShape)],
    value: function pushValue(key, _ref3) {
      var err = _ref3[0];
      var res = _ref3[1];

      var value = [err, res, new Date()];
      this.data[key] = (this.data[key] || []).concat([value]);
      if (_lodash2['default'].has(this.observers, key)) {
        _lodash2['default'].each(this.observers[key], function (fn) {
          return fn(value);
        });
      }
      return this;
    }
  }, {
    key: 'get',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].shape({
      flux: _typecheckDecorator2['default'].instanceOf(HTTPFlux),
      params: paramsShape
    })), _typecheckDecorator.takes(_typecheckDecorator2['default'].String(), _typecheckDecorator2['default'].Object())],
    value: function get(path) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return {
        flux: this,
        params: _Object$assign({}, _lodash2['default'].defaults({}, params, defaultParams), { path: path })
      };
    }
  }, {
    key: 'values',
    decorators: [_typecheckDecorator.returns(valuesType), _typecheckDecorator.takes(paramsShape)],
    value: function values(params) {
      var key = this.constructor.keyFor(params);
      if (!_lodash2['default'].has(this.data, key)) {
        this.data[key] = [];
      }
      return this.data[key];
    }
  }, {
    key: 'request',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].Promise()), _typecheckDecorator.takes(_typecheckDecorator2['default'].String(), _typecheckDecorator2['default'].oneOf(_typecheckDecorator2['default'].exactly('get'), _typecheckDecorator2['default'].exactly('post')), _typecheckDecorator2['default'].option(_typecheckDecorator2['default'].Object()))],
    value: function request(path, method) {
      var _this = this;

      var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var req = undefined;
      return new _bluebird2['default'](function (resolve, reject) {
        req = _superagent2['default'][method](_url2['default'].resolve(_this.baseUrl, path)).accept('json').timeout(_this.options.maxRequestDuration);
        if (opts.query) {
          req = req.query(opts.query);
        }
        if (opts.body) {
          req = req.send(opts.body);
        }
        req.end(function (err, res) {
          if (err) {
            return reject(err);
          }
          return resolve(res.body);
        });
      }).cancellable()['catch'](_bluebird2['default'].CancellationError, function (err) {
        req.abort();
        throw err;
      }).then(function (res) {
        return [void 0, res];
      })['catch'](function (err) {
        return [err.toString(), void 0];
      });
    }
  }, {
    key: 'populate',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].Promise()), _typecheckDecorator.takes(paramsShape)],
    value: function populate(params) {
      var _this2 = this;

      var key = this.constructor.keyFor(params);
      var path = params.path;
      var query = params.query;

      if (!_lodash2['default'].has(this.promises, key)) {
        this.promises[key] = this.request(path, 'get', { query: query }).then(function (_ref4) {
          var err = _ref4[0];
          var res = _ref4[1];
          return _this2.pushValue(key, [err, res]);
        });
      }
      return this.promises[key];
    }
  }, {
    key: 'post',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].Promise()), _typecheckDecorator.takes(_typecheckDecorator2['default'].shape({
      path: _typecheckDecorator2['default'].String(),
      query: _typecheckDecorator2['default'].option(_typecheckDecorator2['default'].any()),
      body: _typecheckDecorator2['default'].option(_typecheckDecorator2['default'].any())
    }))],
    value: function post(_ref5) {
      var path = _ref5.path;
      var query = _ref5.query;
      var body = _ref5.body;

      return this.fetch(path, 'post', { query: query, body: body }).then(function (_ref6) {
        var err = _ref6[1];
        var res = _ref6[2];

        if (err) {
          throw err;
        }
        return res.body;
      });
    }
  }, {
    key: 'observe',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].Function()), _typecheckDecorator.takes(paramsShape, _typecheckDecorator2['default'].Function())],
    value: function observe(params, fn) {
      var _this3 = this;

      var key = this.constructor.keyFor(params);
      if (!_lodash2['default'].has(this.observers, key)) {
        (function () {
          _this3.observers[key] = [];
          var path = params.path;
          var query = params.query;
          var refreshEvery = params.refreshEvery;

          if (refreshEvery) {
            _this3.refreshers[key] = setInterval(function () {
              return _this3.fetch(path, 'get', { query: query }).then(function (_ref7) {
                var err = _ref7[0];
                var res = _ref7[1];
                return _this3.pushValue(key, [err, res]);
              });
            }, refreshEvery);
          }
        })();
      }
      this.observers[key].push(fn);
      if (this.promises[key]) {
        _lodash2['default'].defer(function () {
          return _lodash2['default'].each(_this3.data[key], function (_ref8) {
            var err = _ref8[0];
            var res = _ref8[1];
            return fn([err, res]);
          });
        });
      } else {
        this.populate(params);
      }
      return function () {
        _this3.observers[key].splice(_this3.observers[key].indexOf(fn), 1);
        if (_this3.observers[key].length === 0) {
          if (_lodash2['default'].has(_this3.refreshers, key)) {
            clearInterval(_this3.refreshers[key]);
            delete _this3.refreshers[key];
          }
          delete _this3.observers[key];
          delete _this3.data[key];
          delete _this3.promises[key];
        }
      };
    }
  }]);

  return HTTPFlux;
})(_2.Flux);

exports['default'] = HTTPFlux;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fdGVzdHNfXy9maXh0dXJlcy9mbHV4ZXMvSFRUUEZsdXguanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3NCQUFjLFFBQVE7Ozs7MEJBQ0MsWUFBWTs7OzttQkFDbkIsS0FBSzs7Ozt3QkFDRCxVQUFVOzs7O2tDQUM4QixxQkFBcUI7Ozs7aUJBRTVELFVBQVU7O0FBRS9CLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLGFBQWEsQ0FBQzs7QUFFdkQsSUFBTSxTQUFTLEdBQUcsZ0NBQUUsTUFBTSxDQUFDLGdDQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7O0FBRXZDLElBQU0sVUFBVSxHQUFHLGdDQUFFLEtBQUssQ0FBQyxDQUN6QixnQ0FBRSxNQUFNLENBQUMsZ0NBQUUsS0FBSyxDQUFDLGdDQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRSxnQ0FBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQ2xELGdDQUFFLEdBQUcsRUFBRSxFQUNQLGdDQUFFLE1BQU0sQ0FBQyxnQ0FBRSxLQUFLLENBQUMsZ0NBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLGdDQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FDbEQsQ0FBQyxDQUFDO0FBQ0gsSUFBTSxVQUFVLEdBQUcsZ0NBQUUsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7O0FBRWpELElBQU0sWUFBWSxHQUFHLGdDQUFFLEtBQUssQ0FBQztBQUMzQixvQkFBa0IsRUFBRSxTQUFTO0FBQzdCLFdBQVMsRUFBRSxTQUFTO0NBQ3JCLENBQUMsQ0FBQztBQUNILElBQU0sY0FBYyxHQUFHO0FBQ3JCLG9CQUFrQixFQUFFLEtBQUs7QUFDekIsV0FBUyxFQUFFLElBQUk7Q0FDaEIsQ0FBQzs7QUFFRixJQUFNLFdBQVcsR0FBRyxnQ0FBRSxLQUFLLENBQUM7QUFDMUIsTUFBSSxFQUFFLGdDQUFFLE1BQU0sRUFBRTtBQUNoQixP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RSxNQUNJO0FBQ0gsWUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUN2QjtBQUNELGFBQU8sWUFBTTtBQUNYLGVBQUssU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFLLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0QsWUFBRyxPQUFLLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ25DLGNBQUcsb0JBQUUsR0FBRyxDQUFDLE9BQUssVUFBVSxFQUFFLEdBQUcsQ0FBQyxFQUFFO0FBQzlCLHlCQUFhLENBQUMsT0FBSyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNwQyxtQkFBTyxPQUFLLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztXQUM3QjtBQUNELGlCQUFPLE9BQUssU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLGlCQUFPLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLGlCQUFPLE9BQUssUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzNCO09BQ0YsQ0FBQztLQUNIOzs7U0FoTEcsUUFBUTs7O3FCQW1MQyxRQUFRIiwiZmlsZSI6Il9fdGVzdHNfXy9maXh0dXJlcy9mbHV4ZXMvSFRUUEZsdXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgc3VwZXJhZ2VudCBmcm9tICdzdXBlcmFnZW50JztcclxuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xyXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XHJcbmltcG9ydCBULCB7IHRha2VzIGFzIGRldlRha2VzLCByZXR1cm5zIGFzIGRldlJldHVybnMgfSBmcm9tICd0eXBlY2hlY2stZGVjb3JhdG9yJztcclxuXHJcbmltcG9ydCB7IEZsdXggfSBmcm9tICcuLi8uLi8uLic7XHJcblxyXG5jb25zdCBfX0RFVl9fID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCc7XHJcblxyXG5jb25zdCBvcHROdW1iZXIgPSBULm9wdGlvbihULk51bWJlcigpKTtcclxuXHJcbmNvbnN0IHZhbHVlU2hhcGUgPSBULnNoYXBlKFtcclxuICBULm9wdGlvbihULm9uZU9mKFQuaW5zdGFuY2VPZihFcnJvciksIFQuU3RyaW5nKCkpKSxcclxuICBULmFueSgpLFxyXG4gIFQub3B0aW9uKFQub25lT2YoVC5pbnN0YW5jZU9mKERhdGUpLCBULlN0cmluZygpKSksXHJcbl0pO1xyXG5jb25zdCB2YWx1ZXNUeXBlID0gVC5BcnJheSh7IHR5cGU6IHZhbHVlU2hhcGUgfSk7XHJcblxyXG5jb25zdCBvcHRpb25zU2hhcGUgPSBULnNoYXBlKHtcclxuICBtYXhSZXF1ZXN0RHVyYXRpb246IG9wdE51bWJlcixcclxuICBtYXhBZ2VudHM6IG9wdE51bWJlcixcclxufSk7XHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xyXG4gIG1heFJlcXVlc3REdXJhdGlvbjogMzAwMDAsXHJcbiAgbWF4QWdlbnRzOiAxMDAwLFxyXG59O1xyXG5cclxuY29uc3QgcGFyYW1zU2hhcGUgPSBULnNoYXBlKHtcclxuICBwYXRoOiBULlN0cmluZygpLFxyXG4gIHF1ZXJ5OiBULk9iamVjdCgpLFxyXG4gIHJlZnJlc2hFdmVyeTogb3B0TnVtYmVyLFxyXG59KTtcclxuY29uc3QgZGVmYXVsdFBhcmFtcyA9IHtcclxuICBxdWVyeToge30sXHJcbiAgcmVmcmVzaEV2ZXJ5OiB2b2lkIDAsXHJcbn07XHJcblxyXG5jbGFzcyBIVFRQRmx1eCBleHRlbmRzIEZsdXgge1xyXG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdIVFRQRmx1eCc7XHJcblxyXG4gIEBkZXZUYWtlcyhULnNoYXBlKHtcclxuICAgIGJhc2VVcmw6IFQuU3RyaW5nKCksXHJcbiAgICBvcHRpb25zOiBvcHRpb25zU2hhcGUsXHJcbiAgICBkYXRhOiBULk9iamVjdCh7IHR5cGU6IHZhbHVlc1R5cGUgfSksXHJcbiAgfSkpXHJcbiAgQGRldlJldHVybnMoVC5pbnN0YW5jZU9mKEhUVFBGbHV4KSlcclxuICBzdGF0aWMgdW5zZXJpYWxpemUoeyBiYXNlVXJsLCBvcHRpb25zLCBkYXRhIH0pIHtcclxuICAgIHJldHVybiBuZXcgSFRUUEZsdXgoYmFzZVVybCwgb3B0aW9ucywgZGF0YSk7XHJcbiAgfVxyXG5cclxuICBAZGV2VGFrZXMocGFyYW1zU2hhcGUpXHJcbiAgQGRldlJldHVybnMoVC5TdHJpbmcoKSlcclxuICBzdGF0aWMga2V5Rm9yKHBhcmFtcykge1xyXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHBhcmFtcyk7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihiYXNlVXJsLCBvcHRpb25zID0ge30sIGRhdGEgPSB7fSkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIGlmKF9fREVWX18pIHtcclxuICAgICAgVC5TdHJpbmcoKShiYXNlVXJsKTtcclxuICAgICAgb3B0aW9uc1NoYXBlKG9wdGlvbnMpO1xyXG4gICAgICBULk9iamVjdCh7IHR5cGU6IHZhbHVlc1R5cGUgfSkoZGF0YSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLm9yaWdpbmFsT3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBfLmRlZmF1bHRzKHt9LCBvcHRpb25zLCBkZWZhdWx0T3B0aW9ucyk7XHJcbiAgICB0aGlzLmJhc2VVcmwgPSBiYXNlVXJsO1xyXG4gICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgIHRoaXMucHJvbWlzZXMgPSBfLm1hcFZhbHVlcyhkYXRhLCAoW2VyciwgcmVzXSkgPT4gUHJvbWlzZS5yZXNvbHZlKFtlcnIsIHJlc10pKTtcclxuICAgIHRoaXMub2JzZXJ2ZXJzID0ge307XHJcbiAgICB0aGlzLnJlZnJlc2hlcnMgPSB7fTtcclxuICB9XHJcblxyXG4gIEBkZXZSZXR1cm5zKFQuc2hhcGUoe1xyXG4gICAgYmFzZVVybDogVC5TdHJpbmcoKSxcclxuICAgIG9wdGlvbnM6IG9wdGlvbnNTaGFwZSxcclxuICAgIGRhdGE6IFQuT2JqZWN0KHsgdHlwZTogdmFsdWVzVHlwZSB9KSxcclxuICB9KSlcclxuICBzZXJpYWxpemUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBiYXNlVXJsOiB0aGlzLmJhc2VVcmwsXHJcbiAgICAgIG9wdGlvbnM6IHRoaXMub3JpZ2luYWxPcHRpb25zLFxyXG4gICAgICBkYXRhOiB0aGlzLmRhdGEsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKFQuU3RyaW5nKCksIHZhbHVlU2hhcGUpXHJcbiAgQGRldlJldHVybnMoVC5pbnN0YW5jZU9mKEhUVFBGbHV4KSlcclxuICBwdXNoVmFsdWUoa2V5LCBbZXJyLCByZXNdKSB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IFtlcnIsIHJlcywgbmV3IERhdGUoKV07XHJcbiAgICB0aGlzLmRhdGFba2V5XSA9ICh0aGlzLmRhdGFba2V5XSB8fCBbXSkuY29uY2F0KFt2YWx1ZV0pO1xyXG4gICAgaWYoXy5oYXModGhpcy5vYnNlcnZlcnMsIGtleSkpIHtcclxuICAgICAgXy5lYWNoKHRoaXMub2JzZXJ2ZXJzW2tleV0sIChmbikgPT4gZm4odmFsdWUpKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKFQuU3RyaW5nKCksIFQuT2JqZWN0KCkpXHJcbiAgQGRldlJldHVybnMoVC5zaGFwZSh7XHJcbiAgICBmbHV4OiBULmluc3RhbmNlT2YoSFRUUEZsdXgpLFxyXG4gICAgcGFyYW1zOiBwYXJhbXNTaGFwZSxcclxuICB9KSlcclxuICBnZXQocGF0aCwgcGFyYW1zID0ge30pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZsdXg6IHRoaXMsXHJcbiAgICAgIHBhcmFtczogT2JqZWN0LmFzc2lnbih7fSwgXy5kZWZhdWx0cyh7fSwgcGFyYW1zLCBkZWZhdWx0UGFyYW1zKSwgeyBwYXRoIH0pLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIEBkZXZUYWtlcyhwYXJhbXNTaGFwZSlcclxuICBAZGV2UmV0dXJucyh2YWx1ZXNUeXBlKVxyXG4gIHZhbHVlcyhwYXJhbXMpIHtcclxuICAgIGNvbnN0IGtleSA9IHRoaXMuY29uc3RydWN0b3Iua2V5Rm9yKHBhcmFtcyk7XHJcbiAgICBpZighXy5oYXModGhpcy5kYXRhLCBrZXkpKSB7XHJcbiAgICAgIHRoaXMuZGF0YVtrZXldID0gW107XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW2tleV07XHJcbiAgfVxyXG5cclxuICBAZGV2VGFrZXMoXHJcbiAgICBULlN0cmluZygpLFxyXG4gICAgVC5vbmVPZihULmV4YWN0bHkoJ2dldCcpLCBULmV4YWN0bHkoJ3Bvc3QnKSksXHJcbiAgICBULm9wdGlvbihULk9iamVjdCgpKVxyXG4gIClcclxuICBAZGV2UmV0dXJucyhULlByb21pc2UoKSlcclxuICByZXF1ZXN0KHBhdGgsIG1ldGhvZCwgb3B0cyA9IHt9KSB7XHJcbiAgICBsZXQgcmVxO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgcmVxID0gc3VwZXJhZ2VudFttZXRob2RdKHVybC5yZXNvbHZlKHRoaXMuYmFzZVVybCwgcGF0aCkpXHJcbiAgICAgICAgLmFjY2VwdCgnanNvbicpXHJcbiAgICAgICAgLnRpbWVvdXQodGhpcy5vcHRpb25zLm1heFJlcXVlc3REdXJhdGlvbik7XHJcbiAgICAgIGlmKG9wdHMucXVlcnkpIHtcclxuICAgICAgICByZXEgPSByZXEucXVlcnkob3B0cy5xdWVyeSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYob3B0cy5ib2R5KSB7XHJcbiAgICAgICAgcmVxID0gcmVxLnNlbmQob3B0cy5ib2R5KTtcclxuICAgICAgfVxyXG4gICAgICByZXEuZW5kKChlcnIsIHJlcykgPT4ge1xyXG4gICAgICAgIGlmKGVycikge1xyXG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzb2x2ZShyZXMuYm9keSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYW5jZWxsYWJsZSgpXHJcbiAgICAuY2F0Y2goUHJvbWlzZS5DYW5jZWxsYXRpb25FcnJvciwgKGVycikgPT4ge1xyXG4gICAgICByZXEuYWJvcnQoKTtcclxuICAgICAgdGhyb3cgZXJyO1xyXG4gICAgfSlcclxuICAgIC50aGVuKChyZXMpID0+IFt2b2lkIDAsIHJlc10pXHJcbiAgICAuY2F0Y2goKGVycikgPT4gW2Vyci50b1N0cmluZygpLCB2b2lkIDBdKTtcclxuICB9XHJcblxyXG4gIEBkZXZUYWtlcyhwYXJhbXNTaGFwZSlcclxuICBAZGV2UmV0dXJucyhULlByb21pc2UoKSlcclxuICBwb3B1bGF0ZShwYXJhbXMpIHtcclxuICAgIGNvbnN0IGtleSA9IHRoaXMuY29uc3RydWN0b3Iua2V5Rm9yKHBhcmFtcyk7XHJcbiAgICBjb25zdCB7IHBhdGgsIHF1ZXJ5IH0gPSBwYXJhbXM7XHJcbiAgICBpZighXy5oYXModGhpcy5wcm9taXNlcywga2V5KSkge1xyXG4gICAgICB0aGlzLnByb21pc2VzW2tleV0gPSB0aGlzLnJlcXVlc3QocGF0aCwgJ2dldCcsIHsgcXVlcnkgfSlcclxuICAgICAgICAudGhlbigoW2VyciwgcmVzXSkgPT4gdGhpcy5wdXNoVmFsdWUoa2V5LCBbZXJyLCByZXNdKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlc1trZXldO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKFQuc2hhcGUoe1xyXG4gICAgcGF0aDogVC5TdHJpbmcoKSxcclxuICAgIHF1ZXJ5OiBULm9wdGlvbihULmFueSgpKSxcclxuICAgIGJvZHk6IFQub3B0aW9uKFQuYW55KCkpLFxyXG4gIH0pKVxyXG4gIEBkZXZSZXR1cm5zKFQuUHJvbWlzZSgpKVxyXG4gIHBvc3QoeyBwYXRoLCBxdWVyeSwgYm9keSB9KSB7XHJcbiAgICByZXR1cm4gdGhpcy5mZXRjaChwYXRoLCAncG9zdCcsIHsgcXVlcnksIGJvZHkgfSlcclxuICAgIC50aGVuKChbLCBlcnIsIHJlc10pID0+IHtcclxuICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXMuYm9keTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKHBhcmFtc1NoYXBlLCBULkZ1bmN0aW9uKCkpXHJcbiAgQGRldlJldHVybnMoVC5GdW5jdGlvbigpKVxyXG4gIG9ic2VydmUocGFyYW1zLCBmbikge1xyXG4gICAgY29uc3Qga2V5ID0gdGhpcy5jb25zdHJ1Y3Rvci5rZXlGb3IocGFyYW1zKTtcclxuICAgIGlmKCFfLmhhcyh0aGlzLm9ic2VydmVycywga2V5KSkge1xyXG4gICAgICB0aGlzLm9ic2VydmVyc1trZXldID0gW107XHJcbiAgICAgIGNvbnN0IHsgcGF0aCwgcXVlcnksIHJlZnJlc2hFdmVyeSB9ID0gcGFyYW1zO1xyXG4gICAgICBpZihyZWZyZXNoRXZlcnkpIHtcclxuICAgICAgICB0aGlzLnJlZnJlc2hlcnNba2V5XSA9IHNldEludGVydmFsKCgpID0+XHJcbiAgICAgICAgICB0aGlzLmZldGNoKHBhdGgsICdnZXQnLCB7IHF1ZXJ5IH0pXHJcbiAgICAgICAgICAgIC50aGVuKChbZXJyLCByZXNdKSA9PiB0aGlzLnB1c2hWYWx1ZShrZXksIFtlcnIsIHJlc10pKVxyXG4gICAgICAgICwgcmVmcmVzaEV2ZXJ5KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5vYnNlcnZlcnNba2V5XS5wdXNoKGZuKTtcclxuICAgIGlmKHRoaXMucHJvbWlzZXNba2V5XSkge1xyXG4gICAgICBfLmRlZmVyKCgpID0+IF8uZWFjaCh0aGlzLmRhdGFba2V5XSwgKFtlcnIsIHJlc10pID0+IGZuKFtlcnIsIHJlc10pKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5wb3B1bGF0ZShwYXJhbXMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgdGhpcy5vYnNlcnZlcnNba2V5XS5zcGxpY2UodGhpcy5vYnNlcnZlcnNba2V5XS5pbmRleE9mKGZuKSwgMSk7XHJcbiAgICAgIGlmKHRoaXMub2JzZXJ2ZXJzW2tleV0ubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgaWYoXy5oYXModGhpcy5yZWZyZXNoZXJzLCBrZXkpKSB7XHJcbiAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMucmVmcmVzaGVyc1trZXldKTtcclxuICAgICAgICAgIGRlbGV0ZSB0aGlzLnJlZnJlc2hlcnNba2V5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVsZXRlIHRoaXMub2JzZXJ2ZXJzW2tleV07XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZGF0YVtrZXldO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLnByb21pc2VzW2tleV07XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIVFRQRmx1eDtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
